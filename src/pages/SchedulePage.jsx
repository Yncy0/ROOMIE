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

      try {
        // Fetch data from Supabase based on the provided schema
        const { data, error } = await supabase
          .from("booking")
          .select(`
            booking_id,
            created_at,
            time_in,
            time_out,
            subject_code,
            section,
            rooms (
              room_id,
              room_name,
              room_description,
              room_capacity,
              room_location
            ),
            users (*)
            
            
          `);

        if (error) {
          console.error("Error fetching data:", error);
          setIsLoading(false);
          return;
        }

        const transformedData = transformData(data);
        setScheduleData(transformedData);
        setFilteredData(transformedData);

        // Extract unique options for filters
        const rooms = Array.from(new Set(data.map((item) => item.rooms?.room_name || "Unknown")));
        const users = Array.from(new Set(data.map((item) => item.schedule?.users?.user_name || "Unknown")));
        const sections = Array.from(new Set(data.map((item) => item.section || "Unknown")));

        setRoomOptions(rooms);
        setUserOptions(users);
        setSectionOptions(sections);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data) =>
    data.map((item) => {
      const startDate = dayjs(item.time_in).toDate();
      const endDate = dayjs(item.time_out).toDate();

      return {
        event_id: item.booking_id || "N/A",
        start: startDate,
        end: endDate,
        title: item.rooms?.room_name || "Unknown Room",
        subtitle: `Professor: ${item.schedule?.users?.user_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status || "Unknown"),
        status: item.status || "Unknown",
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.section || "Unknown Section",
        username: item.schedule?.users?.user_name || "Unknown",
        time_in: item.schedule?.time_in || "N/A",
        time_out: item.schedule?.time_out || "N/A",
        subject_code: item.subject_code || "N/A",
      };
    });

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
      filtered = filtered.filter((event) => {
        if (filterCriteria === "User") {
          return event.username.toLowerCase().includes(value.toLowerCase());
        } else if (filterCriteria === "Room Name") {
          return event.room_name.toLowerCase().includes(value.toLowerCase());
        } else if (filterCriteria === "Section") {
          return event.section.toLowerCase().includes(value.toLowerCase());
        } else if (filterCriteria === "Status") {
          return event.status.toLowerCase().includes(value.toLowerCase());
        } else if (filterCriteria === "ID") {
          return event.event_id.toString().includes(value);
        }
        return false;
      });
      setFilteredData(filtered);
    }
  };

  const CustomEventCard = (event) => (
    <Tooltip
      title={`Room: ${event.room_name}\nSubject: ${event.subject_code}\nTime: ${event.time_in} - ${event.time_out}\nProfessor: ${event.user_name}`}
      arrow
    >
      <Card sx={{ backgroundColor: event.color, margin: "5px", padding: "10px" }}>
        <CardContent>
          <Typography variant="h6" component="div">{event.room_name}</Typography>
          <Typography variant="body2">{event.subject_code}</Typography>
          <Typography variant="body2">{`Professor: ${event.username}`}</Typography>
          <Typography variant="body2">{`Time: ${event.time_in} - ${event.time_out}`}</Typography>
        </CardContent>
      </Card>
    </Tooltip>
  );

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
            eventRenderer={CustomEventCard}
          />
        )}
      </Box>
    </Box>
  );
};

export default SchedulePage;