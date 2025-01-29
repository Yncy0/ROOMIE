import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Autocomplete, CircularProgress } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import supabase from "@/utils/supabase";
import CustomEventCard from "@/components/schedule/customEventCard";
import "@/components/schedule/calendar-overrides.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


// Enable dayjs plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const SchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState("All")
  const [selectedFilterValue, setSelectedFilterValue] = useState("")
  const [roomOptions, setRoomOptions] = useState([])
  const [userOptions, setUserOptions] = useState([])
  const [sectionOptions, setSectionOptions] = useState([])
  const [statusOptions] = useState(["Incoming", "In Progress", "Complete", "Cancelled"])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch data from "booked_rooms" table
      const { data: bookedRoomsData, error: bookedRoomsError } = await supabase.from("booked_rooms").select(`
          date,
          time_in,
          time_out,
          subject_code,
          course_and_section,
          status,
          profiles (*),
          rooms (room_name),
          room_id
        `);

      if (bookedRoomsError) {
        console.error("Error fetching booked rooms data:", bookedRoomsError);
        setIsLoading(false);
        return;
      }

      // Fetch data from "schedule" table
      const { data: scheduleData, error: scheduleError } = await supabase.from("schedule").select(`
          days,
          time_in,
          time_out,
          subject_id,
          course_id,
          status,
          profiles (*),
          rooms (room_name),
          room_id,
          subject(*)
        `);

      if (scheduleError) {
        console.error("Error fetching schedule data:", scheduleError);
        setIsLoading(false);
        return;
      }

      const transformedBookingData = transformBookingData(bookedRoomsData);
      const transformedScheduleData = transformScheduleData(scheduleData);

      const combinedData = [...transformedBookingData, ...transformedScheduleData];
      setScheduleData(combinedData);
      setFilteredData(combinedData);

      const rooms = Array.from(new Set(combinedData.map((item) => item.room_name || "Unknown")));
      const users = Array.from(new Set(combinedData.map((item) => item.user_name || "Unknown")));
      const sections = Array.from(new Set(combinedData.map((item) => item.section || "Unknown")));

      setRoomOptions(rooms);
      setUserOptions(users);
      setSectionOptions(sections);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const transformBookingData = (data) =>
    data.map((item) => {
      const startDate = item.time_in
        ? dayjs.utc(item.time_in).tz("Asia/Manila", true).toDate() // Correct conversion to Manila timezone
        : null;
      const endDate = item.time_out
        ? dayjs.utc(item.time_out).tz("Asia/Manila", true).toDate() // Correct conversion to Manila timezone
        : null;
  
      const formattedStart = startDate ? dayjs(startDate).format("h:mm") : "Unknown"; // Standard 12-hour format without AM/PM
      const formattedEnd = endDate ? dayjs(endDate).format("h:mm") : "Unknown"; // Standard 12-hour format without AM/PM
  
      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${item.date || "Unknown"}`,
        start: startDate,
        end: endDate,
        title: item.rooms?.room_name || "Unknown Room",
        subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status),
        status: item.status,
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.course_and_section || "Unknown",
        user_name: item.profiles?.full_name || "Unknown",
        time_in: formattedStart,
        time_out: formattedEnd,
        subject_code: item.subject_code || "Unknown",
  
        // Formatted output for display:
        formattedTime: `${formattedStart} - ${formattedEnd}`,
        formattedInfo: `Room: ${item.rooms?.room_name || "Unknown Room"}\nSubject: ${item.subject_code || "Unknown Subject"}\nTime: ${formattedStart} - ${formattedEnd}\nProfessor: ${item.profiles?.full_name ? "Prof. " + item.profiles?.full_name : "Unknown Professor"}`
      };
    });
  

  

  const weekdayToDates = (weekday) => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let targetDayIndices = [];

    if (typeof weekday === "string") {
      const days = weekday.split(",").map((day) => day.trim());
      targetDayIndices = days.map((day) => weekdays.indexOf(day)).filter((index) => index !== -1);
    } else if (Array.isArray(weekday)) {
      targetDayIndices = weekday.map((day) => weekdays.indexOf(day)).filter((index) => index !== -1);
    }

    if (targetDayIndices.length === 0) {
      console.warn(`Invalid weekday provided: ${weekday}`);
      return [];
    }

    const currentYear = dayjs().year();
    const firstDayOfYear = dayjs(`${currentYear}-01-01`);
    const lastDayOfYear = dayjs(`${currentYear}-12-31`);

    let currentDay = firstDayOfYear;
    const dates = [];

    while (currentDay.isBefore(lastDayOfYear) || currentDay.isSame(lastDayOfYear)) {
      if (targetDayIndices.includes(currentDay.day())) {
        dates.push(currentDay.toDate());
      }
      currentDay = currentDay.add(1, "day");
    }

    return dates;
  };

  const transformScheduleData = (data) => {
    return data
      .flatMap((item) => {
        const timeFormat = "H:mm:ss";
        let dates = [];

        try {
          dates = weekdayToDates(item.days);
        } catch (error) {
          console.error(`Error processing days for item: ${JSON.stringify(item)}`, error);
          return [];
        }

        return dates.map((baseDate) => {
          const startDateString = item.time_in ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_in}` : null;
          const endDateString = item.time_out ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_out}` : null;

          const startDate = startDateString
            ? dayjs.tz(startDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate()
            : null;
          const endDate = endDateString
            ? dayjs.tz(endDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate()
            : null;

          return {
            event_id: `${item.rooms?.room_name || "Unknown"}-${item.days || "Unknown"}-${baseDate}`,
            start: startDate,
            end: endDate,
            title: item.rooms?.room_name || "Unknown Room",
            subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
            color: getColorBasedOnStatus(item.status),
            status: item.status || "Unknown",
            room_name: item.rooms?.room_name || "Unknown Room",
            section: item.course_id || "Unknown",
            user_name: item.profiles?.full_name || "Unknown",
            time_in: item.time_in || "Unknown",
            time_out: item.time_out || "Unknown",
            subject_code: item.subject?.subject_code || "Unknown",
            subject_name: item.subject?.subject_name || "Unknown",
          };
        });
      })
      .filter(Boolean);
  };
  const getColorBasedOnStatus = (status) => {
    switch (status) {
      case "Incoming":
        return "#cae9ff"
      case "In Progress":
        return "#a3cef1"
      case "Complete":
        return "#8ebee6"
      case "Cancelled":
        return "#84a9d9"
      default:
        return "#fff"
    }
  }

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value)
    setSelectedFilterValue("")
    if (event.target.value === "All") {
      setFilteredData(scheduleData)
    }
  }

  const handleFilterValueChange = (event, newValue) => {
    setSelectedFilterValue(newValue)
    applyFilter(filterType, newValue)
  }

  const applyFilter = (filterCriteria, value) => {
    if (filterCriteria === "All") {
      setFilteredData(scheduleData)
    } else {
      const filtered = scheduleData.filter((event) => {
        switch (filterCriteria) {
          case "User":
            return event.user_name.toLowerCase().includes(value.toLowerCase())
          case "Room":
            return event.room_name.toLowerCase().includes(value.toLowerCase())
          case "Section":
            return event.section.toLowerCase().includes(value.toLowerCase())
          case "Status":
            return event.status.toLowerCase() === value.toLowerCase()
          default:
            return true
        }
      })
      setFilteredData(filtered)
    }
  }

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
    },
  })

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Schedule
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField select label="Filter By" value={filterType} onChange={handleFilterTypeChange} sx={{ minWidth: 200 }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">Professor</MenuItem>
          <MenuItem value="Room">Room</MenuItem>
          <MenuItem value="Section">Section</MenuItem>
          <MenuItem value="Status">Status</MenuItem>
        </TextField>

        {filterType !== "All" && (
          <Autocomplete
            value={selectedFilterValue}
            onChange={handleFilterValueChange}
            options={
              filterType === "User"
                ? userOptions
                : filterType === "Room"
                  ? roomOptions
                  : filterType === "Section"
                    ? sectionOptions
                    : statusOptions
            }
            renderInput={(params) => <TextField {...params} label={`Filter by ${filterType}`} />}
            sx={{ minWidth: 300 }}
          />
        )}
      </Box>
     


      <Box sx={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
      <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          events={filteredData}
          initialView="timeGridWeek"
          eventContent={(eventInfo) => <CustomEventCard event={eventInfo.event} />}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          height="100%"
          eventColor={(event) => event.extendedProps.color}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
        />
      </Box>
    </Box>
  );
};

export default SchedulePage;
