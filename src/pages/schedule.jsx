import React, { useEffect, useState, useMemo } from "react";
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
import debounce from "lodash.debounce";
import supabase from "../utils/supabase";

// Enable dayjs plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const SchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [filterValue, setFilterValue] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const statusOptions = ["Incoming", "In Progress", "Complete", "Cancelled"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch data concurrently
        const [bookedRoomsResponse, scheduleResponse] = await Promise.all([
          supabase.from("booked_rooms").select(`
              date, time_in, time_out, subject_code, course_and_section, status,
              profiles (full_name), rooms (room_name), room_id
            `),
          supabase.from("schedule").select(`
              days, time_in, time_out, subject_id, course_id, status,
              profiles (full_name), rooms (room_name), room_id
            `),
        ]);

        if (bookedRoomsResponse.error) throw bookedRoomsResponse.error;
        if (scheduleResponse.error) throw scheduleResponse.error;

        // Transform and combine data
        const transformedBookingData = transformBookingData(
          bookedRoomsResponse.data
        );
        const transformedScheduleData = transformScheduleData(
          scheduleResponse.data
        );
        const combinedData = [
          ...transformedBookingData,
          ...transformedScheduleData,
        ];

        setScheduleData(combinedData);

        // Extract unique options for filtering
        setRoomOptions([
          ...new Set(combinedData.map((item) => item.room_name || "Unknown")),
        ]);
        setUserOptions([
          ...new Set(combinedData.map((item) => item.user_name || "Unknown")),
        ]);
        setSectionOptions([
          ...new Set(combinedData.map((item) => item.section || "Unknown")),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformBookingData = (data) => {
    return data.map((item) => {
      const start =
        item.date && item.time_in
          ? combineDateAndTime(item.date, item.time_in)
          : null;
      const end =
        item.date && item.time_out
          ? combineDateAndTime(item.date, item.time_out)
          : null;

      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${
          item.date || "Unknown"
        }`,
        start,
        end,
        title: item.rooms?.room_name || "Unknown Room",
        subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status),
        status: item.status,
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.course_and_section || "Unknown",
        user_name: item.profiles?.full_name || "Unknown",
        time_in: item.time_in || "Unknown",
        time_out: item.time_out || "Unknown",
        subject_code: item.subject_code || "Unknown",
      };
    });
  };

  const transformScheduleData = (data) => {
    return data.flatMap((item) => {
      const dates = getWeekdayDates(item.days);
      return dates.map((date) => {
        const start = item.time_in
          ? combineDateAndTime(dayjs(date).format("YYYY-MM-DD"), item.time_in)
          : null;
        const end = item.time_out
          ? combineDateAndTime(dayjs(date).format("YYYY-MM-DD"), item.time_out)
          : null;

        return {
          event_id: `${item.rooms?.room_name || "Unknown"}-${
            item.days
          }-${date}`,
          start,
          end,
          title: item.rooms?.room_name || "Unknown Room",
          subtitle: `Prof. ${item.profiles?.full_name || "Unknown"}`,
          color: getColorBasedOnStatus(item.status),
          status: item.status || "Unknown",
          room_name: item.rooms?.room_name || "Unknown Room",
          section: item.course_id || "Unknown",
          user_name: item.profiles?.full_name || "Unknown",
          time_in: item.time_in || "Unknown",
          time_out: item.time_out || "Unknown",
          subject_name: item.subject_id || "Unknown",
        };
      });
    });
  };

  const combineDateAndTime = (date, time) => {
    return dayjs
      .tz(`${date} ${time}`, "YYYY-MM-DD H:mm:ss", "Asia/Manila")
      .toDate();
  };

  const getWeekdayDates = (weekday) => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const targetDayIndex = weekdays.indexOf(weekday);
    if (targetDayIndex === -1) return [];

    const year = dayjs().year();
    let currentDate = dayjs(`${year}-01-01`);
    const endOfYear = dayjs(`${year}-12-31`);
    const dates = [];

    while (currentDate.isBefore(endOfYear) || currentDate.isSame(endOfYear)) {
      if (currentDate.day() === targetDayIndex)
        dates.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const getColorBasedOnStatus = (status) => {
    const colors = {
      Incoming: "#cae9ff",
      "In Progress": "#a3cef1",
      Complete: "#8ebee6",
      Cancelled: "#84a9d9",
    };
    return colors[status] || "#fff";
  };

  const filteredData = useMemo(() => {
    if (filterType === "All" || !filterValue) return scheduleData;

    return scheduleData.filter((event) => {
      const value = filterValue.toLowerCase();
      switch (filterType) {
        case "User":
          return event.user_name.toLowerCase().includes(value);
        case "Room Name":
          return event.room_name.toLowerCase().includes(value);
        case "Section":
          return event.section.toLowerCase().includes(value);
        case "Status":
          return event.status.toLowerCase().includes(value);
        default:
          return true;
      }
    });
  }, [filterType, filterValue, scheduleData]);

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = debounce((_, newValue) => {
    setFilterValue(newValue || "");
  }, 300);

  const CustomEventCard = (event) => (
    <Tooltip
      title={`Room: ${event.room_name}\nSubject: ${event.subject_code}\nTime: ${event.time_in} - ${event.time_out}\nProfessor: ${event.user_name}`}
      arrow
    >
      <Card
        sx={{ backgroundColor: event.color, margin: "5px", padding: "10px" }}
      >
        <CardContent>
          <Typography variant="h6">{event.room_name}</Typography>
          <Typography variant="body2">{event.subject_code}</Typography>
          <Typography variant="body2">Professor: {event.user_name}</Typography>
          <Typography variant="body2">{`Time: ${event.time_in} - ${event.time_out}`}</Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );

  return (
    <Box sx={{ padding: 3 }}>
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

        <Autocomplete
          fullWidth
          options={
            filterType === "User"
              ? userOptions
              : filterType === "Room Name"
              ? roomOptions
              : filterType === "Section"
              ? sectionOptions
              : filterType === "Status"
              ? statusOptions
              : []
          }
          onInputChange={handleFilterValueChange}
          renderInput={(params) => (
            <TextField {...params} label={`Search ${filterType}`} />
          )}
        />
      </Box>

      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h5">Schedule</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Scheduler
            view="week"
            events={filteredData}
            loading={isLoading}
            week={{ startHour: 7, endHour: 22 }}
            day={{ startHour: 7, endHour: 22 }}
            eventRender={CustomEventCard}
          />
        )}
      </Box>
    </Box>
  );
};

export default SchedulePage;
