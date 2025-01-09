import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import supabase from "../supabaseConfig";

// Enable dayjs plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const SchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [statusOptions] = useState(["Incoming", "In Progress", "Complete", "Cancelled"]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch data from "booking" table
      const { data: bookingData, error: bookingError } = await supabase
        .from("booking")
        .select(
          `rooms (room_name),
          subject_code,
          section,
          time_in,
          time_out,
          status, 
          date, 
          users (user_name)`
        );

      if (bookingError) {
        console.error("Error fetching booking data:", bookingError);
        setIsLoading(false);
        return;
      }

      // Fetch data from "schedule" table
      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedule")
        .select(
          `rooms (room_name),
          subject_code,
          section,
          time_in,
          time_out,
          status,
          weekday,
          users (user_name)`
        );

      if (scheduleError) {
        console.error("Error fetching schedule data:", scheduleError);
        setIsLoading(false);
        return;
      }

      const transformedBookingData = transformBookingData(bookingData);
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
      const dateFormat = "YYYY/MM/DD";
      const timeFormat = "H:mm:ss";

      const startDateString = item.date && item.time_in ? `${item.date} ${item.time_in}` : null;
      const endDateString = item.date && item.time_out ? `${item.date} ${item.time_out}` : null;

      const startDate = startDateString
        ? dayjs.tz(startDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila").toDate()
        : null;
      const endDate = endDateString
        ? dayjs.tz(endDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila").toDate()
        : null;

      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${item.date || "Unknown"}`,
        start: startDate,
        end: endDate,
        title: item.rooms?.room_name || "Unknown Room",
        subtitle: `Prof. ${item.users?.user_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status),
        status: item.status,
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.section || "Unknown",
        user_name: item.users?.user_name || "Unknown",
        time_in: item.time_in || "Unknown",
        time_out: item.time_out || "Unknown",
        subject_code: item.subject_code || "Unknown",
        weekday: startDate ? dayjs(startDate).format("dddd") : "Unknown",
      };
    });

  const transformScheduleData = (data) => {
    const weekdayToDates = (weekday) => {
      const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDayIndex = weekdays.indexOf(weekday);
    
      if (targetDayIndex === -1) {
        throw new Error("Invalid weekday provided");
      }
    
      const currentYear = dayjs().year(); // Get the current year
      const firstDayOfYear = dayjs(`${currentYear}-01-01`);
      const lastDayOfYear = dayjs(`${currentYear}-12-31`);
    
      let currentDay = firstDayOfYear;
      const dates = [];
    
      // Loop through all the days in the year
      while (currentDay.isBefore(lastDayOfYear) || currentDay.isSame(lastDayOfYear)) {
        if (currentDay.day() === targetDayIndex) {
          dates.push(currentDay.toDate());
        }
        currentDay = currentDay.add(1, "day");
      }
    
      return dates;
    };

    return data.flatMap((item) => {
      const timeFormat = "H:mm:ss";
      const dates = weekdayToDates(item.weekday); // Get dates for the specified weekday

      return dates.map((baseDate) => {
        const startDateString = item.time_in
          ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_in}`
          : null;
        const endDateString = item.time_out
          ? `${dayjs(baseDate).format("YYYY-MM-DD")} ${item.time_out}`
          : null;

        const startDate = startDateString
          ? dayjs.tz(startDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate()
          : null;
        const endDate = endDateString
          ? dayjs.tz(endDateString, `YYYY-MM-DD ${timeFormat}`, "Asia/Manila").toDate()
          : null;

        return {
          event_id: `${item.rooms?.room_name || "Unknown"}-${item.weekday || "Unknown"}-${baseDate}`,
          start: startDate,
          end: endDate,
          title: item.rooms?.room_name || "Unknown Room",
          subtitle: `Prof. ${item.users?.user_name || "Unknown"}`,
          color: getColorBasedOnStatus(item.status),
          status: item.status || "Unknown",
          room_name: item.rooms?.room_name || "Unknown Room",
          section: item.section || "Unknown",
          user_name: item.users?.user_name || "Unknown",
          time_in: item.time_in || "Unknown",
          time_out: item.time_out || "Unknown",
          subject_code: item.subject_code || "Unknown",
          weekday: item.weekday || "Unknown",
        };
      });
    });
  };

  const getColorBasedOnStatus = (status) => {
    switch (status) {
      case "Incoming":
        return "#cae9ff";
      case "In Progress":
        return "#a3cef1";
      case "Complete":
        return "#8ebee6";
      case "Cancelled":
        return "#84a9d9";
      default:
        return "#fff";
    }
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setSelectedFilterValue("");
  };

  const handleFilterValueChange = (event, newValue) => {
    setSelectedFilterValue(newValue);
    applyFilter(filterType, newValue);
  };

  const applyFilter = (filterCriteria, value) => {
    let filtered = scheduleData;

    if (filterCriteria === "All") {
      setFilteredData(scheduleData);
    } else {
      if (filterCriteria === "User") {
        filtered = filtered.filter((event) =>
          event.user_name.toLowerCase().includes(value.toLowerCase())
        );
      } else if (filterCriteria === "Room Name") {
        filtered = filtered.filter((event) =>
          event.room_name.toLowerCase().includes(value.toLowerCase())
        );
      } else if (filterCriteria === "Section") {
        filtered = filtered.filter((event) =>
          event.section.toLowerCase().includes(value.toLowerCase())
        );
      } else if (filterCriteria === "Status") {
        filtered = filtered.filter((event) =>
          event.status.toLowerCase().includes(value.toLowerCase())
        );
      }
    }

    setFilteredData(filtered);
  };

  const CustomEventCard = (event) => {
    return (
      <Tooltip
        title={`Room: ${event.room_name} \nSubject: ${event.subject_code} \nTime: ${event.time_in} - ${event.time_out} \nProfessor: ${event.user_name}`}
        arrow
      >
        <Card sx={{ backgroundColor: event.color, color: "black", margin: "5px", padding: "10px" }}>
          <CardContent>
            <Typography variant="h6" component="div">{event.room_name}</Typography>
            <Typography variant="body2">{event.subject_code}</Typography>
            <Typography variant="body2">{`Professor: ${event.user_name}`}</Typography>
            <Typography variant="body2">{`Time: ${event.time_in} - ${event.time_out}`}</Typography>
          </CardContent>
        </Card>
      </Tooltip>
    );
  };

  return (
    <Box sx={{ padding: 3, color: "black" }}>
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h6">Filter by</Typography>

        <TextField
          select
          fullWidth
          label="Select Filter"
          value={filterType}
          onChange={handleFilterTypeChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Room Name">Room Name</MenuItem>
          <MenuItem value="Section">Section</MenuItem>
          <MenuItem value="Status">Status</MenuItem>
        </TextField>

        {filterType === "Room Name" && (
          <Autocomplete
            fullWidth
            options={roomOptions}
            value={selectedFilterValue}
            onInputChange={handleFilterValueChange}
            renderInput={(params) => <TextField {...params} label="Search Room" />}
          />
        )}

        {filterType === "User" && (
          <Autocomplete
            fullWidth
            options={userOptions}
            value={selectedFilterValue}
            onInputChange={handleFilterValueChange}
            renderInput={(params) => <TextField {...params} label="Search User" />}
          />
        )}

        {filterType === "Section" && (
          <Autocomplete
            fullWidth
            options={sectionOptions}
            value={selectedFilterValue}
            onInputChange={handleFilterValueChange}
            renderInput={(params) => <TextField {...params} label="Search Section" />}
          />
        )}

        {filterType === "Status" && (
          <Autocomplete
            fullWidth
            options={statusOptions}
            value={selectedFilterValue}
            onInputChange={handleFilterValueChange}
            renderInput={(params) => <TextField {...params} label="Search Status" />}
          />
        )}
      </Box>

      <Box sx={{ padding: "20px", marginTop: 5 }}>
        <Typography variant="h5" gutterBottom>
          Room Schedule
        </Typography>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Scheduler
            view="week"
            events={filteredData}
            loading={isLoading}
            week={{
              startHour: 7.0,
              endHour: 22.0,
              step: 60,
            }}
            day={{
              startHour: 7.0,
              endHour: 22.0,
              step: 60,
            }}
            eventRender={CustomEventCard}
          />
        )}
      </Box>
    </Box>
  );
};

export default SchedulePage;
