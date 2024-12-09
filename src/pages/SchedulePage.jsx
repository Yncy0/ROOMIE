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
  const [filterType, setFilterType] = useState("All"); // Store selected filter type
  const [selectedFilterValue, setSelectedFilterValue] = useState(""); // Store the selected filter value
  const [roomOptions, setRoomOptions] = useState([]); // Store available rooms for search
  const [userOptions, setUserOptions] = useState([]); // Store available users for search
  const [sectionOptions, setSectionOptions] = useState([]); // Store available sections for search
  const [statusOptions, setStatusOptions] = useState(["Incoming", "In Progress", "Complete", "Cancelled"]); // Status options

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch data from Supabase
      const { data, error } = await supabase
      .from('booked_rooms')
      .select(`
        *,
        rooms(
          *,
          id,
          building (
            *,
            id
          ),
          schedule(
            *,
            id,
            users(
              *,
              id,
              subject(
                *,
                id
              )
            )
          )
        )
      `);
         

      if (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        return;
      }

      const transformedData = transformData(data);
      setScheduleData(transformedData);
      setFilteredData(transformedData); // Initially show all data

      // Collect unique options for filter fields





      
      const rooms = Array.from(new Set(data.map((item) => item.room_name)));
      const users = Array.from(new Set(data.map((item) => item.users?.user_name || "Unknown")));
      const sections = Array.from(new Set(data.map((item) => item.section)));

      setRoomOptions(rooms);
      setUserOptions(users);
      setSectionOptions(sections);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const transformData = (data) =>
    data.map((item) => {
      const dateFormat = "YYYY/MM/DD";
      const timeFormat = "H:mm:ss";

      const startDateString = `${item.date} ${item.time_in}`;
      const endDateString = `${item.date} ${item.time_out}`;

      const startDate = dayjs
        .tz(startDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila")
        .toDate();
      const endDate = dayjs
        .tz(endDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila")
        .toDate();

      const timeIn = dayjs(item.time_in, timeFormat).format("h:mm A");
      const timeOut = dayjs(item.time_out, timeFormat).format("h:mm A");

      return {
        event_id: item.id, // Use item.id as unique identifier
        start: startDate,
        end: endDate,
        title: item.room_id.room_name,
        subtitle: `Professor: ${item.users?.user_name || "Unknown"}`,
        color: getColorBasedOnStatus(item.status),
        status: item.status,
        room_name: item.room_id.room_name,
        section: item.section,
        user_name: item.users?.user_name || "Unknown",
        time_in: item.room_id.schedule_id.time_in,
        time_out: item.room_id.schedule_id.time_out,
        subject_code: item.subject?.subject_code,
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

  // Handle filter type change
  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setSelectedFilterValue(""); // Reset the selected value for a new filter type
  };

  // Handle the filter value change (searchable dropdown or text input)
  const handleFilterValueChange = (event, newValue) => {
    setSelectedFilterValue(newValue);
    applyFilter(filterType, newValue);
  };

  // Apply the filter based on the selected filter type and value
  const applyFilter = (filterCriteria, value) => {
    let filtered = scheduleData;
  
    if (filterCriteria === "All") {
      // Reset to show all data when "All" is selected
      setFilteredData(scheduleData);
    } else {
      // Apply filters based on filter type
      if (filterCriteria === "User") {
        filtered = filtered.filter((event) => event.user_name.toLowerCase().includes(value.toLowerCase()));
      } else if (filterCriteria === "Room Name") {
        filtered = filtered.filter((event) => event.room_name.toLowerCase().includes(value.toLowerCase()));
      } else if (filterCriteria === "Section") {
        filtered = filtered.filter((event) => event.section.toLowerCase().includes(value.toLowerCase()));
      } else if (filterCriteria === "Status") {
        filtered = filtered.filter((event) => event.status.toLowerCase().includes(value.toLowerCase()));
      } else if (filterCriteria === "ID") {
        filtered = filtered.filter((event) => event.id.toString().includes(value));
      }
  
      setFilteredData(filtered);
    }
  };

  // Custom Event Card Renderer
  const CustomEventCard = (event) => {
    return (
      <Tooltip
        title={`Room: ${event.room_name} \nSubject: ${event.subject_code} \nTime: ${event.time_in} - ${event.time_out} \nProfessor: ${event.user_name}`}
        arrow
      >
        <Card sx={{ backgroundColor: event.color, margin: "5px", padding: "10px" }}>
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

      {/* Filter Section */}
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

        {/* Filter Input based on filter type */}
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

      {/* Main Content */}
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
              startHour: 7.0, // 7:00 AM
              endHour: 22.0, // 10:00 PM
              step: 60, // 60-minute intervals (1 hour)
            }}
            day={{
              startHour: 7.0, // 7:00 AM
              endHour: 22.0, // 10:00 PM
              step: 60, // 60-minute intervals (1 hour)
            }}
            eventRender={CustomEventCard} // Custom event card rendering
          />
        )}
      </Box>
    </Box>
  );
};

export default SchedulePage;
