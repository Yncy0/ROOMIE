import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import supabase from "@/utils/supabase";

const EventModal = ({
  modalOpen,
  closeModal,
  modalType,
  formData,
  setFormData,
  selectedEvent,
  rooms,
  handleFormChange,
  handleFormSubmit,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState({ names: [] });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase.from("subject").select("subject_code");
        if (error) throw new Error(error.message);
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      }
    };
  
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase.from("course").select("course_name");
        if (error) throw new Error(error.message);
        setCourses({ names: [...new Set(data.map((course) => course.course_name))] });
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };
  
    const formatTime = (datetimeString) => {
      if (!datetimeString) return "";
      const date = new Date(datetimeString);
      return isNaN(date.getTime()) ? "" : date.toISOString().substr(11, 5); // Ensure valid date
    };
  
    if (modalOpen) {
      fetchSubjects();
      fetchCourses();
  
      if (selectedEvent) {
        const newFormData = {
          room_id: selectedEvent.room_id || "",
          subject_code: selectedEvent.subject_code || "",
          course_name: selectedEvent.course_name || "",
          status: selectedEvent.status || "",
        };
  
        if (modalType === "booking") {
          newFormData.date = selectedEvent.date || "";
          newFormData.time_in = formatTime(selectedEvent.time_in);
          newFormData.time_out = formatTime(selectedEvent.time_out);
        } else if (modalType === "schedule") {
          newFormData.days = selectedEvent.days || "";
          newFormData.time_in = selectedEvent.time_in || ""; // Keep raw format
          newFormData.time_out = selectedEvent.time_out || ""; // Keep raw format
        }
  
        setFormData(newFormData);
      }
    }
  }, [modalOpen, selectedEvent, modalType]);
  

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxHeight: "90vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3.5,
          borderRadius: 1,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          {modalType === "booking" && selectedEvent
            ? "Edit Booking"
            : modalType === "schedule" && selectedEvent
            ? "Edit Schedule"
            : "Add " + (modalType === "booking" ? "Booking" : "Schedule")}
        </Typography>

        {modalType === "booking" && selectedEvent && (
          <TextField label="Booking ID" value={selectedEvent.booking_id} fullWidth disabled sx={{ marginBottom: 2 }} />
        )}
        {modalType === "schedule" && selectedEvent && (
          <TextField label="Schedule ID" value={selectedEvent.schedule_id} fullWidth disabled sx={{ marginBottom: 2 }} />
        )}

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="room-select-label">Room</InputLabel>
          <Select
            labelId="room-select-label"
            value={formData.room_id}
            onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>{room.room_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Subject Code</InputLabel>
          <Select name="subject_code" value={formData.subject_code} onChange={handleFormChange}>
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_code} value={subject.subject_code}>{subject.subject_code}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Section</InputLabel>
          <Select name="course_name" value={formData.course_name} onChange={handleFormChange}>
            {courses.names.map((name) => (
              <MenuItem key={name} value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {modalType === "booking" && (
          <TextField label="Date" name="date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleFormChange} sx={{ marginBottom: 2 }} />
        )}

        {modalType === "schedule" && (
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Days</InputLabel>
            <Select name="days" value={formData.days} onChange={handleFormChange}>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <TextField label="Time In" name="time_in" type="time" fullWidth InputLabelProps={{ shrink: true }} value={formData.time_in} onChange={handleFormChange} sx={{ marginBottom: 2 }} />
        <TextField label="Time Out" name="time_out" type="time" fullWidth InputLabelProps={{ shrink: true }} value={formData.time_out} onChange={handleFormChange} sx={{ marginBottom: 2 }} />

       

        <Button variant="contained" color="primary" fullWidth onClick={handleFormSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default EventModal;
