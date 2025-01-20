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
  Fab,
} from "@mui/material";
import supabase from "@/utils/supabase";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import PrintIcon from "@mui/icons-material/Print"; // Import the print icon
import PrintablePage from "./print";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

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
    schedule_id: "",
    booking_id: "",
  });

  const [rooms, setRooms] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
          "*, rooms (*), subject_code, section, time_in, time_out, status, weekday, users (user_name, user_email, user_department, user_id)"
        );

      if (scheduleError) {
        console.error("Error fetching schedule data:", scheduleError);
        setIsLoading(false);
        return;
      }

      const { data: bookingData, error: bookingError } = await supabase
        .from("booking")
        .select(
          "*, rooms (*), subject_code, section, time_in, time_out, status, date, weekday, users (user_name, user_email, user_department, user_id)"
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
        event_id: `${item.rooms?.room_name || "Unknown"}-${
          item.weekday || "Unknown"
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
        schedule_id: item.schedule_id || "", // Include schedule_id for schedules
        booking_id: item.booking_id || "", // Include booking_id for bookings
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
    const userBooking = bookingData.filter((event) => event.user_name === user);

    setFilteredData([...userSchedule, ...userBooking]);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const openModal = (type, event) => {
    setModalType(type);

    if (event) {
      setSelectedEvent(event); // Set selected event for editing
      setFormData({
        room_id: event.room_id,
        subject_code: event.subject_code,
        section: event.section,
        date: event.date || "", // Optional for schedules
        time_in: event.time_in,
        time_out: event.time_out,
        weekday: event.weekday || "", // Optional for bookings
      });
    } else {
      setSelectedEvent(null); // Reset for adding new data
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
    }

    setModalOpen(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printableContent"); // Get the printable content
    const printWindow = window.open("", "_blank", "width=800,height=600"); // Open a new window
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>@media print { body { font-family: Arial, sans-serif; font-size: 12px; } }</style>"
    );
    printWindow.document.write("<body>");
    printWindow.document.write(printContent.innerHTML); // Write the content to the print window
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print(); // Trigger print dialog
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    // Check if a user is selected
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    // Find the user by user_name and validate user_id
    const user = allUsers.find((item) => item.user_name === selectedUser);
    if (!user || !user.user_id) {
      console.error("Error: User ID is missing or invalid.");
      return;
    }

    // Prepare the formatted data with the user_id included
    const formattedData = { ...formData, user_id: user.user_id };

    // Automatically set weekday for bookings based on the selected date
    if (modalType === "booking" && formattedData.date) {
      const bookingWeekday = dayjs(formattedData.date).format("dddd");
      formattedData.weekday = bookingWeekday; // Set the weekday automatically
    }

    // Validate for conflicts
    const conflictMessage = await checkScheduleBookingConflict(formattedData);
    if (conflictMessage) {
      alert(conflictMessage); // Show the conflict message from checkScheduleBookingConflict
      return; // Stop further execution
    }

    let actionResult;

    if (modalType === "booking") {
      // Validate date for booking
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

      // Calculate status for booking based on current time
      formattedData.status = dayjs().isBefore(startDateTime)
        ? "Incoming"
        : dayjs().isBefore(endDateTime)
        ? "In Progress"
        : "Complete";

      // Remove weekday field for booking (since booking doesn't need it in this step)
      // Comment or remove this line to ensure the weekday is saved
      // delete formattedData.weekday;

      if (selectedEvent) {
        const { error } = await supabase
          .from("booking")
          .update(formattedData)
          .eq("booking_id", selectedEvent.booking_id);
        actionResult = error
          ? `Error updating booking: ${error.message}`
          : "Booking updated successfully";
      } else {
        const { data, error } = await supabase
          .from("booking")
          .insert([formattedData]);
        if (error) {
          actionResult = `Error adding booking: ${error.message}`;
        } else if (data && data.length > 0) {
          const newBookingId = data[0].booking_id;
          actionResult = "Booking added successfully. ID: " + newBookingId;
        } else {
          actionResult = "Booking added successfully!";
        }
      }
    } else if (modalType === "schedule") {
      // Existing schedule logic remains the same
      if (!formattedData.weekday) {
        alert("Weekday is required for schedules.");
        return;
      }

      delete formattedData.date;

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

        formattedData.status = dayjs().isBefore(startDateTime)
          ? "Incoming"
          : dayjs().isBefore(endDateTime)
          ? "In Progress"
          : "Complete";
      } else {
        formattedData.status = dayjs().isBefore(
          dayjs().day(formattedData.weekday)
        )
          ? "Incoming"
          : "Complete";
      }

      if (selectedEvent) {
        const { error } = await supabase
          .from("schedule")
          .update(formattedData)
          .eq("schedule_id", selectedEvent.schedule_id);
        actionResult = error
          ? `Error updating schedule: ${error.message}`
          : "Schedule updated successfully";
      } else {
        const { data, error } = await supabase
          .from("schedule")
          .insert([formattedData]);
        if (error) {
          actionResult = `Error adding schedule: ${error.message}`;
        } else if (data && data.length > 0) {
          const newScheduleId = data[0].schedule_id;
          actionResult = "Schedule added successfully. ID: " + newScheduleId;
        } else {
          actionResult = "Schedule added successfully!";
        }
      }
    }

    alert(actionResult);
    closeModal();
  };

  const checkScheduleBookingConflict = async (formattedData) => {
    const { room_id, weekday, time_in, time_out, date, selectedUserId } =
      formattedData;

    console.log(
      "Checking for schedule vs booking conflicts with data:",
      formattedData
    );

    const newStart = dayjs(time_in, "HH:mm");
    const newEnd = dayjs(time_out, "HH:mm");

    if (!newStart.isValid() || !newEnd.isValid()) {
      console.error("Invalid time format for time_in or time_out.");
      return null; // No conflict found
    }

    // --- Booking vs Booking Conflict Check (date-based) ---
    if (date) {
      const { data: existingBookings, error: bookingError } = await supabase
        .from("booking")
        .select(
          "*, rooms (*), subject_code, section, time_in, time_out, status, date, weekday, user_id"
        )
        .eq("room_id", room_id)
        .eq("date", date); // Filter by room_id and date for bookings

      if (bookingError) {
        console.error("Error fetching bookings:", bookingError.message);
        return null; // No conflict found
      }

      // Check if any existing booking conflicts with the new booking
      const bookingConflictMessage = await Promise.all(
        existingBookings.map(async (record, index) => {
          const recordStart = dayjs(record.time_in, "HH:mm");
          const recordEnd = dayjs(record.time_out, "HH:mm");

          const conflict =
            newStart.isBetween(recordStart, recordEnd, null, "[)") ||
            newEnd.isBetween(recordStart, recordEnd, null, "(]") ||
            (newStart.isSameOrBefore(recordStart) &&
              newEnd.isSameOrAfter(recordEnd));

          if (conflict) {
            console.log(`Conflicting Booking User ID: ${record.user_id}`);

            // Fetch the user name by user_id
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("user_name")
              .eq("user_id", record.user_id)
              .single();

            if (userError) {
              console.error("Error fetching user name:", userError.message);
              return null;
            }

            const userName = userData?.user_name || "Unknown User";
            return `A conflict has been detected with another booking.\nConflicting Booking: ${userName} in the Booking tab (Row: ${
              index + 1
            }).`;
          }

          return null; // No conflict for this record
        })
      );

      const conflictMessage = bookingConflictMessage.find(
        (message) => message !== null
      );
      if (conflictMessage) {
        return conflictMessage; // Return the first conflict message found
      }
    }

    // --- Schedule vs Schedule Conflict Check (weekday-based) ---
    const { data: existingSchedules, error: scheduleError } = await supabase
      .from("schedule")
      .select("*, user_id")
      .eq("room_id", room_id)
      .eq("weekday", weekday); // Filter by room_id and weekday for schedules

    if (scheduleError) {
      console.error("Error fetching schedules:", scheduleError.message);
      return null; // No conflict found
    }

    const scheduleConflictMessage = await Promise.all(
      existingSchedules.map(async (record, index) => {
        const recordStart = dayjs(record.time_in, "HH:mm");
        const recordEnd = dayjs(record.time_out, "HH:mm");

        const conflict =
          newStart.isBetween(recordStart, recordEnd, null, "[)") ||
          newEnd.isBetween(recordStart, recordEnd, null, "(]") ||
          (newStart.isSameOrBefore(recordStart) &&
            newEnd.isSameOrAfter(recordEnd));

        if (conflict) {
          console.log(`Conflicting Schedule User ID: ${record.user_id}`);

          // Fetch the user name by user_id
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("user_name")
            .eq("user_id", record.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user name:", userError.message);
            return null;
          }

          const userName = userData?.user_name || "Unknown User";
          return `A conflict has been detected with another schedule.\nConflicting Schedule: ${userName} in the Schedule tab (Row: ${
            index + 1
          }).`;
        }

        return null; // No conflict for this record
      })
    );

    const scheduleConflict = scheduleConflictMessage.find(
      (message) => message !== null
    );
    if (scheduleConflict) {
      return scheduleConflict; // Return the first conflict message found
    }

    // --- Schedule vs Booking Conflict Check (weekday-based) ---
    const {
      data: existingBookingsForSchedule,
      error: bookingForScheduleError,
    } = await supabase
      .from("booking")
      .select(
        "*, rooms (*), subject_code, section, time_in, time_out, status, date, weekday, user_id"
      )
      .eq("room_id", room_id)
      .eq("weekday", weekday); // Filter by room_id and weekday for bookings

    if (bookingForScheduleError) {
      console.error(
        "Error fetching bookings for schedule:",
        bookingForScheduleError.message
      );
      return null; // No conflict found
    }

    const bookingConflictForScheduleMessage = await Promise.all(
      existingBookingsForSchedule.map(async (record, index) => {
        const recordStart = dayjs(record.time_in, "HH:mm");
        const recordEnd = dayjs(record.time_out, "HH:mm");

        const conflict =
          newStart.isBetween(recordStart, recordEnd, null, "[)") ||
          newEnd.isBetween(recordStart, recordEnd, null, "(]") ||
          (newStart.isSameOrBefore(recordStart) &&
            newEnd.isSameOrAfter(recordEnd));

        if (conflict) {
          console.log(
            `Conflicting Booking User ID (Schedule): ${record.user_id}`
          );

          // Fetch the user name by user_id
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("user_name")
            .eq("user_id", record.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user name:", userError.message);
            return null;
          }

          const userName = userData?.user_name || "Unknown User";
          return `A conflict has been detected with a booking.\nConflicting Booking: ${userName} in the Booking tab (Row: ${
            index + 1
          }).`;
        }

        return null; // No conflict for this record
      })
    );

    const bookingConflictForSchedule = bookingConflictForScheduleMessage.find(
      (message) => message !== null
    );
    if (bookingConflictForSchedule) {
      return bookingConflictForSchedule; // Return the first conflict message found
    }

    console.log("No conflicts detected in schedules or bookings.");
    return null; // No conflict found
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

  // Add Function
  const add = async (dataToAdd, table) => {
    try {
      const { data, error } = await supabase.from(table).insert([dataToAdd]);
      if (error) {
        console.error(`Error adding to ${table}:`, error.message);
        alert(`Error adding to ${table}: ${error.message}`);
        return null;
      }
      alert(`Successfully added to ${table}.`);
      return data[0];
    } catch (err) {
      console.error("Unexpected error in add function:", err.message);
      alert("Unexpected error. Please try again.");
      return null;
    }
  };

  const [showIdColumn, setShowIdColumn] = useState(false); // State to control visibility of the ID column

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

            {/* Printable Content Wrapper */}
            <div id="printableContent" className="printable-content">
              <PrintablePage
                selectedUser={selectedUser}
                userInfo={userInfo}
                scheduleData={scheduleData}
              />
            </div>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ marginBottom: 2 }}
            >
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
                        <td
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
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
                        <td
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
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
                        <td
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
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
                        <td
                          style={{ padding: "8px", border: "1px solid #ccc" }}
                        >
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
                          {showIdColumn && <TableCell>Booking ID</TableCell>}{" "}
                          {/* Conditionally render Booking ID */}
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
                            <TableRow
                              key={index}
                              onClick={() => openModal("booking", event)}
                            >
                              {showIdColumn && (
                                <TableCell>{event.booking_id}</TableCell>
                              )}{" "}
                              {/* Conditionally render Booking ID */}
                              <TableCell>{event.room_name}</TableCell>
                              <TableCell>{event.subject_code}</TableCell>
                              <TableCell>{event.section}</TableCell>
                              <TableCell>{event.date}</TableCell>
                              <TableCell>{`${event.time_in} - ${event.time_out}`}</TableCell>
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
                          {showIdColumn && <TableCell>Schedule ID</TableCell>}{" "}
                          {/* Conditionally render Schedule ID */}
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
                            <TableRow
                              key={index}
                              onClick={() => openModal("schedule", event)}
                            >
                              {showIdColumn && (
                                <TableCell>{event.schedule_id}</TableCell>
                              )}{" "}
                              {/* Conditionally render Schedule ID */}
                              <TableCell>{event.room_name}</TableCell>
                              <TableCell>{event.subject_code}</TableCell>
                              <TableCell>{event.section}</TableCell>
                              <TableCell>{event.weekday}</TableCell>
                              <TableCell>{`${event.time_in} - ${event.time_out}`}</TableCell>
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
      {/* Floating Action Button (FAB) for printing */}
      <Fab
        color="primary"
        aria-label="print"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={handlePrint} // Make sure the function is correctly referenced
      >
        <PrintIcon />
      </Fab>

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

          {/* Display ID (non-editable) */}
          {modalType === "booking" && selectedEvent && (
            <TextField
              label="Booking ID"
              value={selectedEvent.booking_id}
              fullWidth
              disabled
              sx={{ marginBottom: 2 }}
            />
          )}
          {modalType === "schedule" && selectedEvent && (
            <TextField
              label="Schedule ID"
              value={selectedEvent.schedule_id}
              fullWidth
              disabled
              sx={{ marginBottom: 2 }}
            />
          )}

          {/* Rest of the modal form */}
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
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
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

      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-content, .printable-content * {
              visibility: visible;
            }
            .printable-content {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default UserSchedulePage;
