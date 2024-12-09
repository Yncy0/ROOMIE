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
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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

const UserSchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [selectedFilterValue, setSelectedFilterValue] = useState("");
  const [roomOptions, setRoomOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [statusOptions] = useState(["Incoming", "In Progress", "Complete", "Cancelled"]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
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
          return;
        }

        console.log("Fetched Data:", data);

        const transformedData = transformData(data);
        setScheduleData(transformedData);
        setFilteredData(transformedData);

        // Extract unique options for filters
        const rooms = Array.from(new Set(data.map((item) => item.room_id.room_name)));
        const usersList = Array.from(
          new Set(
            data.map((item) => ({
              id: item.users?.id || "",
              name: item.users?.user_name || "Unknown",
            }))
          )
        );
        const sections = Array.from(new Set(data.map((item) => item.section)));

        setRoomOptions(rooms);
        setUserOptions(usersList);
        setSectionOptions(sections);
        setUsers(usersList);
      } catch (err) {
        console.error("Error during fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data) =>
    data.map((item) => {
      const dateFormat = "YYYY/MM/DD";
      const timeFormat = "H:mm:ss";

      const startDateString = `${item.created_at.split("T")[0]} ${item.room_id.schedule_id.time_in}`;
      const endDateString = `${item.created_at.split("T")[0]} ${item.room_id.schedule_id.time_out}`;

      const startDate = dayjs
        .tz(startDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila")
        .toDate();
      const endDate = dayjs
        .tz(endDateString, `${dateFormat} ${timeFormat}`, "Asia/Manila")
        .toDate();

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

  const handleUserClick = (user) => {
    navigate(`/user/${user.id}`, { state: { user } });
  };

  return (
    <Box sx={{ padding: 3, color: "black" }}>
      {/* User Management Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="h5" gutterBottom>
          User Management
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {users.map((user) => (
            <Card
              key={user.id}
              sx={{ padding: 2, cursor: "pointer" }}
              onClick={() => handleUserClick(user)}
            >
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2">ID: {user.id}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Main Scheduler Content */}
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
            eventRender={(event) => (
              <Tooltip
                title={`Room: ${event.room_name}\nSubject: ${event.subject_code}\nTime: ${event.time_in} - ${event.time_out}\nProfessor: ${event.user_name}`}
                arrow
              >
                <Card
                  sx={{ backgroundColor: event.color, margin: "5px", padding: "10px" }}
                >
                  <CardContent>
                    <Typography variant="h6">{event.room_name}</Typography>
                    <Typography>{event.subject_code}</Typography>
                  </CardContent>
                </Card>
              </Tooltip>
            )}
          />
        )}
      </Box>
    </Box>
  );
};

export default UserSchedulePage;
