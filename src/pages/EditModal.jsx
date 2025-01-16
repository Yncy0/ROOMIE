// EditModal.jsx
import React from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const EditModal = ({ open, onClose, data, onSave }) => {
  const [editedData, setEditedData] = React.useState(data);

  React.useEffect(() => {
    setEditedData(data); // Reset the form when data changes
  }, [data]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Assuming onSave is passed with the function to update the database
    if (onSave) {
      await onSave(editedData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
          Edit Information
        </Typography>

        <TextField
          label="Subject Code"
          name="subject_code"
          value={editedData?.subject_code || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Section"
          name="section"
          value={editedData?.section || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          value={editedData?.date || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Time In"
          name="time_in"
          value={editedData?.time_in || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Time Out"
          name="time_out"
          value={editedData?.time_out || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Room"
          name="room_id"
          value={editedData?.room_name || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          name="status"
          value={editedData?.status || ""}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditModal;
