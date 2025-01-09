import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import supabase from "../supabaseConfig";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const UserSchedulePage = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("booking");
  const [formData, setFormData] = useState({
    subject_code: "",
    section: "",
    date: "",
    time_in: "",
    time_out: "",
    room_id: "",
    user_id: "",
    weekday: "",
  });

  const [rooms, setRooms] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { data: allUsers, error: usersError } = await supabase
        .from("users")
        .select("user_name, user_email, user_department, user_id");

      if (usersError) {
        console.error("Error fetching users:", usersError);
        setIsLoading(false);
        return;
      }

      const { data: scheduleData, error: scheduleError } = await supabase
        .from("schedule")
        .select(
          "rooms (*), subject_code, section, time_in, time_out, status, weekday, users (user_name, user_email, user_department, user_id)"
        );


      if (scheduleError) {
        console.error("Error fetching schedule data:", scheduleError);
        setIsLoading(false);
        return;
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from("booking")
        .select(
          "rooms (*), subject_code, section, time_in, time_out, status, date, users (user_name, user_email, user_department, user_id)"
        );


      if (bookingError) {
        console.error("Error fetching booking data:", bookingError);
        setIsLoading(false);
        return;
      }

      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("room_id, room_name");

      if (roomError) {
        console.error("Error fetching rooms:", roomError);
        setIsLoading(false);
        return;
      }

      setRooms(roomData);

      const transformedScheduleData = transformData(scheduleData);
      const transformedBookingData = transformData(bookingData);

      setScheduleData(transformedScheduleData);
      setBookingData(transformedBookingData);
      setFilteredData(transformedScheduleData);

      const users = Array.from(
        new Set([
          ...scheduleData.map((item) => item.users?.user_name),
          ...bookingData.map((item) => item.users?.user_name),
          ...allUsers.map((user) => user.user_name),
        ])
      );
      setUserOptions(users);
      setAllUsers(allUsers);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const transformData = (data) =>
    data.map((item) => {
      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${item.weekday || "Unknown"
          }`,
        start: item.time_in
          ? dayjs
            .tz(`${item.weekday} ${item.time_in}`, "dddd H:mm", "Asia/Manila")
            .toDate()
          : null,
        end: item.time_out
          ? dayjs
            .tz(
              `${item.weekday} ${item.time_out}`,
              "dddd H:mm",
              "Asia/Manila"
            )
            .toDate()
          : null,
        room_name: item.rooms?.room_name || "Unknown Room",
        section: item.section || "Unknown",
        user_name: item.users?.user_name || "Unknown",
        time_in: item.time_in,
        time_out: item.time_out,
        weekday: item.weekday || "Unknown",
        subject_code: item.subject_code || "Unknown",
        email: item.users?.user_email || "Unknown Email",
        department: item.users?.user_department || "Unknown Department",
        id: item.users?.user_id || "Unknown ID",
        date: item.date,
        status: item.status || "Pending",
      };
    });

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    const selectedUserInfo = allUsers.find((item) => item.user_name === user);
    if (selectedUserInfo) {
      setUserInfo(selectedUserInfo);
    }

    const userSchedule = scheduleData.filter(
      (event) => event.user_name === user
    );
    const userBooking = bookingData.filter(
      (event) => event.user_name === user
    );

    setFilteredData([...userSchedule, ...userBooking]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true); // Ensure this is executed properly to open the modal
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      subject_code: "",
      section: "",
      date: "",
      time_in: "",
      time_out: "",
      room_id: "",
      user_id: "",
      weekday: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }
  
    const user = allUsers.find((item) => item.user_name === selectedUser);
  
    if (!user || !user.user_id) {
      console.error("Error: User ID is missing or invalid.");
      return;
    }
  
    // Prepare the data for insertion
    const formattedData = { ...formData, user_id: user.user_id };
  
    // Calculate status based on date and time
    const now = dayjs(); // Current time
    let status = "Pending"; // Default status
  
    if (modalType === "booking") {
      if (!formattedData.date) {
        alert("Date is required for bookings.");
        return;
      }
  
      const startDateTime = dayjs(
        `${formattedData.date} ${formattedData.time_in}`,
        "YYYY-MM-DD HH:mm"
      );
      const endDateTime = dayjs(
        `${formattedData.date} ${formattedData.time_out}`,
        "YYYY-MM-DD HH:mm"
      );
  
      if (now.isBefore(startDateTime)) {
        status = "Incoming";
      } else if (now.isAfter(startDateTime) && now.isBefore(endDateTime)) {
        status = "In Progress";
      } else if (now.isAfter(endDateTime)) {
        status = "Complete";
      }
  
      formattedData.status = status;
      delete formattedData.weekday; // Ensure 'weekday' is not included in booking data
  
      const { error } = await supabase.from("booking").insert([formattedData]);
      if (error) {
        console.error("Error adding booking:", error);
      } else {
        alert("Booking added successfully");
        closeModal();
      }
    } else if (modalType === "schedule") {
      if (!formattedData.weekday) {
        alert("Weekday is required for schedules.");
        return;
      }
  
      const todayWeekday = dayjs().format("dddd");
      const isToday = todayWeekday === formattedData.weekday;
  
      if (isToday) {
        const startDateTime = dayjs(
          `${todayWeekday} ${formattedData.time_in}`,
          "dddd HH:mm"
        );
        const endDateTime = dayjs(
          `${todayWeekday} ${formattedData.time_out}`,
          "dddd HH:mm"
        );
  
        if (now.isBefore(startDateTime)) {
          status = "Incoming";
        } else if (now.isAfter(startDateTime) && now.isBefore(endDateTime)) {
          status = "In Progress";
        } else if (now.isAfter(endDateTime)) {
          status = "Complete";
        }
      } else if (now.isBefore(dayjs().day(dayjs().day(formattedData.weekday)))) {
        status = "Incoming";
      } else {
        status = "Complete";
      }
  
      formattedData.status = status;
      delete formattedData.date; // Ensure 'date' is not included in schedule data
  
      const { error } = await supabase.from("schedule").insert([formattedData]);
      if (error) {
        console.error("Error adding schedule:", error);
      } else {
        alert("Schedule added successfully");
        closeModal();
      }
    }
  };
  
  

  return (
    <Box sx={{ padding: 3, color: "black", display: "flex" }}>
      <Box sx={{ width: "200px", borderRight: "1px solid #ccc" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          All Users
        </Typography>
        <List>
          {userOptions.map((user) => (
            <ListItem
              button={true}
              key={user}
              onClick={() => handleUserSelection(user)}
            >
              <ListItemText primary={user} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1, padding: "20px" }}>
        {selectedUser && (
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", marginBottom: 2 }}
            >
              {selectedUser} Information
            </Typography>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
              <Tab label="User Info" />
              <Tab label="Booking Info" />
              <Tab label="Schedule Info" />
            </Tabs>
            {activeTab === 0 && (
              <Card sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    User Information
                  </Typography>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: "10px",
                    }}
                  >
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid #ccc",
                          }}
                        >
                          Name
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                          {selectedUser}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid #ccc",
                          }}
                        >
                          ID
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                          {userInfo?.user_id || "Unknown ID"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid #ccc",
                          }}
                        >
                          Email
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                          {userInfo?.user_email || "Unknown Email"}
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontWeight: "bold",
                            padding: "8px",
                            border: "1px solid #ccc",
                          }}
                        >
                          Department
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                          {userInfo?.user_department || "Unknown Department"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
            {activeTab === 1 && (
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Booking Information
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openModal("booking")}
                    >
                      Add Booking
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Room Name</TableCell>
                          <TableCell>Subject Code</TableCell>
                          <TableCell>Section</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookingData
                          .filter((event) => event.user_name === selectedUser)
                          .map((event, index) => (
                            <TableRow key={index}>
                              <TableCell>{event.room_name}</TableCell>
                              <TableCell>{event.subject_code}</TableCell>
                              <TableCell>{event.section}</TableCell>
                              <TableCell>{event.date}</TableCell>
                              <TableCell>
                                {`${event.time_in} - ${event.time_out}`}
                              </TableCell>
                              <TableCell>{event.status}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
            {activeTab === 2 && (
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Schedule Information
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openModal("schedule")}
                    >
                      Add Schedule
                    </Button>
                  </Box>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Room Name</TableCell>
                          <TableCell>Subject Code</TableCell>
                          <TableCell>Section</TableCell>
                          <TableCell>Weekday</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scheduleData
                          .filter((event) => event.user_name === selectedUser)
                          .map((event, index) => (
                            <TableRow key={index}>
                              <TableCell>{event.room_name}</TableCell>
                              <TableCell>{event.subject_code}</TableCell>
                              <TableCell>{event.section}</TableCell>
                              <TableCell>{event.weekday}</TableCell>
                              <TableCell>
                                {`${event.time_in} - ${event.time_out}`}
                              </TableCell>
                              <TableCell>{event.status}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>

      {/* Modal for adding data */}
      <Modal open={modalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Add {modalType === "booking" ? "Booking" : "Schedule"}
          </Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Room</InputLabel>
            <Select
              name="room_id"
              value={formData.room_id}
              onChange={handleFormChange}
            >
              {rooms.map((room) => (
                <MenuItem key={room.room_id} value={room.room_id}>
                  {room.room_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Subject Code"
            name="subject_code"
            fullWidth
            value={formData.subject_code}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Section"
            name="section"
            fullWidth
            value={formData.section}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          {modalType === "booking" ? (
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleFormChange}
              sx={{ marginBottom: 2 }}
            />
          ) : (
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Weekday</InputLabel>
              <Select
                name="weekday"
                value={formData.weekday}
                onChange={handleFormChange}
              >
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                  (day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Time In"
            name="time_in"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.time_in}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Time Out"
            name="time_out"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.time_out}
            onChange={handleFormChange}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserSchedulePage;
