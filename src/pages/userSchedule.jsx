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
import PrintablePage from "@/components/u_schedule/print";
import EventModal from "@/components/u_schedule/EventModal";
import CheckConflict from "@/components/u_schedule/conflictChecker";
import "@/components/u_schedule/u_schedule.css"; // Import the CSS file

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
    date: "",
    time_in: "",
    time_out: "",
    room_id: "",
    day: "",
    schedule_id: "",
    booking_id: "",
    profile_id: "",
    course_name: "",
    course_year: "",
    course_section: "",
  });
  const [rooms, setRooms] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const showIdColumn = false;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch Users
        const { data: allUsers, error: usersError } = await supabase
          .from("profiles")
          .select("*");
        if (usersError)
          throw new Error("Error fetching users: " + usersError.message);

        // Fetch Schedule
        const { data: scheduleData, error: scheduleError } = await supabase
          .from("schedule")
          .select("*, rooms (*), profiles (*), subject (*), course (*)");
        if (scheduleError)
          throw new Error("Error fetching schedule: " + scheduleError.message);

        // Fetch Bookings
        const { data: bookingData, error: bookingError } = await supabase
          .from("booked_rooms")
          .select("*, rooms (*), profiles (*)");
        if (bookingError)
          throw new Error("Error fetching bookings: " + bookingError.message);

        // Fetch Rooms
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select("*");
        if (roomError)
          throw new Error("Error fetching rooms: " + roomError.message);

        setRooms(roomData);

        // Transform Data
        const transformedScheduleData = transformData(scheduleData, "schedule");
        const transformedBookingData = transformData(bookingData, "booking");

        setScheduleData(transformedScheduleData);
        setBookingData(transformedBookingData);
        setFilteredData(transformedScheduleData);

        // Generate User Options
        const users = Array.from(
          new Set([
            ...scheduleData.map((item) => item.profiles?.username),
            ...bookingData.map((item) => item.profiles?.username),
            ...allUsers.map((user) => user.username),
          ])
        );

        setUserOptions(users);
        setAllUsers(allUsers);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSubjectId = async (subjectCode) => {
    try {
      // Fetch the subject based on subject_code
      const { data: subjectData, error } = await supabase
        .from("subject")
        .select("id")
        .eq("subject_code", subjectCode)
        .single();

      if (error) throw error;

      // Return the subject_id if the subject exists
      if (subjectData) {
        return subjectData.id;
      } else {
        throw new Error("Subject not found.");
      }
    } catch (error) {
      console.error("Error fetching subject:", error.message);
      throw error;
    }
  };

  const transformData = (data, type) =>
    data.map((item) => {
      const isBooking = type === "booking";
      return {
        event_id: `${item.rooms?.room_name || "Unknown"}-${
          item.days || item.date || "Unknown"
        }`,

        start: item.time_in
          ? dayjs
              .utc(item.time_in) // Parse the UTC time first
              .tz("Asia/Manila", true) // Convert to Manila timezone, but keep the same time (without changing)
              .toDate()
          : null,

        end: item.time_out
          ? dayjs
              .utc(item.time_out) // Parse the UTC time first
              .tz("Asia/Manila", true) // Convert to Manila timezone, but keep the same time (without changing)
              .toDate()
          : null,

        room_name: item.rooms?.room_name || "Unknown Room",
        section: isBooking
          ? item.course_and_section || "Unknown Section"
          : item.course?.course_section || "Unknown Section",

        user_name: item.profiles?.username || "Unknown",
        time_in: item.time_in,
        time_out: item.time_out,
        days: item.days || "Unknown",

        subject_code: isBooking
          ? item.subject_name || "Unknown Subject"
          : item.subject?.subject_code || "Unknown",

        subject: isBooking
          ? item.subject_code || "Unknown Subject" // Adjusted for booking
          : item.subject?.subject_code || "Unknown", // Adjusted for schedule

        email: item.profiles?.email || "Unknown Email",
        department: item.profiles?.department || "Unknown Department",
        id: item.profiles?.id || "Unknown ID",
        date: item.date,
        status: item.status || "Pending",

        schedule_id: isBooking ? "" : item.id || "",
        booking_id: isBooking ? item.id || "" : "",

        course_name: isBooking
          ? item.course_name || "Unknown Course"
          : item.course?.course_name || "Unknown Course",

        course_year: isBooking
          ? item.course_year || "Unknown Year"
          : item.course?.course_year || "Unknown Year",

        course_section: isBooking
          ? item.course_and_section || "Unknown Section"
          : item.course?.course_section || "Unknown Section",

        // New fields for extracted booking times (only time, no date)
        book_timeIn: item.time_in
          ? dayjs
              .utc(item.time_in) // Parse UTC time
              .tz("Asia/Manila", true) // Convert to Asia/Manila time without changing the time
              .format("HH:mm:ss") // Only time, no date
          : null,

        book_timeOut: item.time_out
          ? dayjs
              .utc(item.time_out) // Parse UTC time
              .tz("Asia/Manila", true) // Convert to Asia/Manila time without changing the time
              .format("HH:mm:ss") // Only time, no date
          : null,
      };
    });

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    const selectedUserInfo = allUsers.find((item) => item.username === user);

    // Log selectedUserInfo to check the structure
    console.log("Selected User Info:", selectedUserInfo);

    if (selectedUserInfo) {
      setUserInfo({
        user_id: selectedUserInfo.id, // Make sure `id` exists
        user_email: selectedUserInfo.email, // Make sure `email` exists
        user_department: selectedUserInfo.department, // Make sure `department` exists
      });
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
      setSelectedEvent(event);
      setFormData({
        room_id: event.room_id,
        subject_code: event.subject_code,
        date: event.date || "",
        time_in: event.time_in,
        time_out: event.time_out,
        days: event.days || "",
      });
    } else {
      setSelectedEvent(null);
      setFormData({
        subject_code: "",
        date: "",
        time_in: "",
        time_out: "",
        room_id: "",
        profile_id: "",
        days: "",
      });
    }
    setModalOpen(true);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("printableContent");
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      "<style>@media print { body { font-family: Arial, sans-serif; font-size: 12px; } }</style>"
    );
    printWindow.document.write("<body>");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    console.log(`Field Changed: ${name}, Value: ${value}`); // Debugging log
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async () => {
    if (!selectedUser) {
      alert("Please select a user first.");
      return;
    }

    const user = allUsers.find((item) => item.username === selectedUser);
    if (!user || !user.id) {
      console.error("Error: Profile ID is missing or invalid.");
      return;
    }

    // Fetch course ID using course_name
    let courseId;
    try {
      const { data: existingCourse, error } = await supabase
        .from("course")
        .select("id")
        .eq("course_name", formData.course_name)
        .single(); // `.single()` ensures only one result is returned

      if (error) {
        alert("Error fetching course. Please verify details.");
        return;
      }

      if (!existingCourse) {
        alert("Course not found. Please check the course name.");
        return;
      }

      courseId = existingCourse.id; // Assign course ID from the fetched course
    } catch (error) {
      console.error("Error fetching course:", error.message);
      return;
    }

    // Fetch subject ID
    let subjectId;
    try {
      subjectId = await getSubjectId(formData.subject_code);
    } catch (error) {
      alert("Error fetching subject. Please verify details.");
      return;
    }
    // Format data for insertion or update
    let formattedData = {
      ...formData,
      profile_id: user.id,
      course_id: courseId, // Use fetched course_id
      subject_id: subjectId, // Ensure subject_id is set
      course_and_section: `${formData.course_name}`,
      subject_code: formData.subject_code, // Ensure subject_code is included
      time_in: formData.date ? `${formData.date}T${formData.time_in}:00` : null,
      time_out: formData.date
        ? `${formData.date}T${formData.time_out}:00`
        : null,
    };

    console.log("Formatted Data Before Insert:", formattedData);

    if (modalType === "booking") {
      if (!formattedData.date) {
        alert("Date is required for bookings.");
        return;
      }

      // Calculate the weekday from the selected date and add it to the formattedData
      const bookingDay = dayjs(formattedData.date).format("dddd"); // Get the weekday name (e.g., "Monday")
      formattedData.days = bookingDay; // Add the day to the booking data

      try {
        if (selectedEvent) {
          // Add new booking
          delete formattedData.course_name;
          delete formattedData.course_section;
          delete formattedData.course_year;
          delete formattedData.course_id;
          delete formattedData.subject_id;
          // Log booking ID and data
          console.log("Booking ID to Update:", selectedEvent.booking_id);
          console.log("Formatted Data for Update:", formattedData);

          // Update existing booking
          const { data, error } = await supabase
            .from("booked_rooms")
            .update(formattedData)
            .eq("id", selectedEvent.booking_id);

          if (error) {
            console.error("Supabase Update Error:", error.message);
            alert("Failed to update booking. Please try again.");
            return;
          }

          console.log("Updated Booking Data:", data);
          alert("Booking updated successfully.");
        } else {
          // Add new booking
          delete formattedData.course_name;
          delete formattedData.course_section;
          delete formattedData.course_year;
          delete formattedData.course_id;
          delete formattedData.subject_id;
          // Insert new booking
          const { data, error } = await supabase
            .from("booked_rooms")
            .insert([formattedData]);

          if (error) {
            throw error;
          }

          console.log("Newly Added Booking Data:", data);
          alert("Booking added successfully.");
        }
      } catch (error) {
        console.error("Error handling booking:", error.message);
        alert("An error occurred while handling booking.");
      }
    } else if (modalType === "schedule") {
      // Remove unnecessary fields
      delete formattedData.course_name;
      delete formattedData.course_section;
      delete formattedData.course_year;
      delete formattedData.subject_code;
      delete formattedData.course_and_section;

      // Validate and format time_in and time_out
      if (!formData.time_in || !dayjs(formData.time_in, "HH:mm").isValid()) {
        console.error("Invalid or missing time_in:", formData.time_in);
        alert("Invalid or missing time_in.");
        return;
      }

      if (!formData.time_out || !dayjs(formData.time_out, "HH:mm").isValid()) {
        console.error("Invalid or missing time_out:", formData.time_out);
        alert("Invalid or missing time_out.");
        return;
      }

      // Format time_in and time_out
      formattedData.time_in = dayjs(formData.time_in, "HH:mm").format(
        "HH:mm:ss"
      );
      formattedData.time_out = dayjs(formData.time_out, "HH:mm").format(
        "HH:mm:ss"
      );

      // Days validation
      if (!formattedData.days) {
        alert("Days are required for schedules.");
        return;
      }

      delete formattedData.date;

      // Determine schedule status
      const todayDays = dayjs().format("dddd");
      const isToday = todayDays === formattedData.days;

      if (isToday) {
        const startDateTime = dayjs(
          `${todayDays} ${formattedData.time_in}`,
          "dddd HH:mm"
        );
        const endDateTime = dayjs(
          `${todayDays} ${formattedData.time_out}`,
          "dddd HH:mm"
        );

        formattedData.status = dayjs().isBefore(startDateTime)
          ? "Incoming"
          : dayjs().isBefore(endDateTime)
          ? "In Progress"
          : "Complete";
      } else {
        formattedData.status = dayjs().isBefore(dayjs().day(formattedData.days))
          ? "Incoming"
          : "Complete";
      }

      // Perform the update or insert
      try {
        if (selectedEvent) {
          // Apply the formatted time_in and time_out during the update
          const { error } = await supabase
            .from("schedule")
            .update({
              ...formattedData, // Ensure all fields, including formatted time_in and time_out, are updated
            })
            .eq("id", selectedEvent.schedule_id);

          if (error) {
            console.error("Error updating schedule:", error.message);
            alert("Failed to update schedule. Please try again.");
            return;
          }
          alert("Schedule updated successfully.");
        } else {
          // Insert new schedule
          const { error } = await supabase
            .from("schedule")
            .insert([formattedData]);
          if (error) {
            console.error("Error adding schedule:", error.message);
            alert("Failed to add schedule. Please try again.");
            return;
          }
          alert("Schedule added successfully.");
        }
        closeModal();
      } catch (err) {
        console.error("Unexpected error:", err.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
    console.log(actionResult);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      subject_code: "",
      date: "",
      time_in: "",
      time_out: "",
      room_id: "",
      user_id: "",
      days: "",
    });
  };

  // Add Function
  const add = async (dataToAdd, table) => {
    const { data, error } = await supabase.from(table).insert([dataToAdd]);
    if (error) {
      console.error(`Error adding to ${table}:`, error.message);
      alert(`Error adding to ${table}: ${error.message}`);
      return null;
    }
    alert(`Successfully added to ${table}.`);
  };

  //table
  return (
    <Box sx={{ padding: 3, color: "white", display: "flex" }}>
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
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#8aa9ff", // Change the color of the underline (highlight) when the tab is selected
                },
              }}
            >
              <Tab
                sx={{
                  color: "#BFD3F5", // Color of unselected tab
                  "&.Mui-selected": {
                    color: "#8aa9ff", // Color of selected tab
                    fontWeight: "bold", // Optional: make selected tab text bold
                  },
                }}
                label="User Info"
              />
              <Tab
                sx={{
                  color: "#BFD3F5",
                  "&.Mui-selected": {
                    color: "#8aa9ff",
                    fontWeight: "bold",
                  },
                }}
                label="Booking Info"
              />
              <Tab
                sx={{
                  color: "#BFD3F5",
                  "&.Mui-selected": {
                    color: "#8aa9ff",
                    fontWeight: "bold",
                  },
                }}
                label="Schedule Info"
              />
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
                      sx={{ fontWeight: "bold", backgroundColor: "#1F305E" }}
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
                              <TableCell>{event.subject}</TableCell>
                              <TableCell>{event.course_section}</TableCell>
                              <TableCell>{event.date}</TableCell>
                              <TableCell>{`${event.book_timeIn} - ${event.book_timeOut}`}</TableCell>
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
                      sx={{ fontWeight: "bold", backgroundColor: "#1F305E" }}
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
                              <TableCell>{`${event.course_name}`}</TableCell>
                              <TableCell>{event.days}</TableCell>
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
            <EventModal
              modalOpen={modalOpen}
              closeModal={() => setModalOpen(false)}
              modalType={modalType}
              formData={formData}
              setFormData={setFormData}
              selectedEvent={selectedEvent}
              rooms={rooms}
              handleFormChange={handleFormChange}
              handleFormSubmit={handleFormSubmit}
            />
          </Box>
        )}
      </Box>
      <Fab
        color="primary"
        aria-label="print"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#B0C4DE",
          color: "#1F305E",
        }}
        onClick={handlePrint}
      >
        <PrintIcon />
      </Fab>

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
