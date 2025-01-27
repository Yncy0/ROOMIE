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
  const [courses, setCourses] = useState({ names: [], years: [], sections: [] });

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

        const names = [...new Set(data.map((course) => course.course_name))];
        

        setCourses({ names});
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };

    if (modalOpen) {
      fetchSubjects();
      fetchCourses();
    }
  }, [modalOpen]);

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Add {modalType === "booking" ? "Booking" : "Schedule"}
        </Typography>

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

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="room-select-label">Room</InputLabel>
          <Select
            labelId="room-select-label"
            value={formData.room_id}
            label="Room"
            onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
          >
            {rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>
                {room.room_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Subject Code</InputLabel>
          <Select
            name="subject_code"
            value={formData.subject_code}
            onChange={handleFormChange}
            label="Subject Code"
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.subject_code} value={subject.subject_code}>
                {subject.subject_code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Section</InputLabel>
            <Select
              name="course_name"
              value={formData.course_name}
              onChange={handleFormChange}
            >
              {courses.names.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

         

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
            <InputLabel>Days</InputLabel>
            <Select
              name="days"
              value={formData.days}
              onChange={handleFormChange}
            >
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
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
  );
};

export default EventModal;
