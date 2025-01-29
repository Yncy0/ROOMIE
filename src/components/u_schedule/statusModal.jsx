import React, { useState, useEffect } from "react"
import { Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import supabase from "@/utils/supabase"

const StatusModal = ({ statusModalOpen, closeStatusModal, selectedEvent, FormData }) => {
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    if (selectedEvent) {
      console.log("Selected Event:", selectedEvent)
      setNewStatus(selectedEvent.status || "")
    }
  }, [selectedEvent])

  const handleStatusUpdate = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update this status?")
    if (!confirmUpdate) return

    // Determine which table and ID to use
    const table = selectedEvent.booking_id ? "booked_rooms" : "schedule"
    const eventId = selectedEvent.booking_id || selectedEvent.schedule_id

    console.log("Updating status for:", {
      table,
      eventId,
      newStatus,
      selectedEvent,
    })

    try {
      const { data, error } = await supabase.from(table).update({ status: newStatus }).eq("id", eventId).select()

      if (error) {
        throw error
      }

      console.log("Update result:", data)

      if (data && data.length > 0) {
        alert("Status updated successfully!")
        if (typeof FormData === "function") {
          FormData() // Refresh data
        }
        closeStatusModal()
      } else {
        alert(`No rows were updated. Please check the event ID: ${eventId}`)
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert(`Failed to update status: ${error.message}`)
    }
  }

  return (
    <Modal open={statusModalOpen} onClose={closeStatusModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Update Status
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 2 }}>
          Event ID: {selectedEvent?.booking_id || selectedEvent?.schedule_id}
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {["Pending", "Incoming", "In Progress", "Complete", "Cancelled"].map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth onClick={handleStatusUpdate}>
          Update Status
        </Button>
      </Box>
    </Modal>
  )
}

export default StatusModal

