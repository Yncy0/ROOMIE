import React from 'react';
import dayjs from 'dayjs';

const CustomTooltip = ({ event }) => {
  const startTime = dayjs(event.startDate).format("h:mm A");
  const endTime = dayjs(event.endDate).format("h:mm A");
  const userName = event.userName || "Unknown";
  const roomName = event.roomName || "Unknown";

  return (
    <div style={{
      padding: '10px', 
      backgroundColor: '#333', 
      color: '#fff', 
      borderRadius: '4px', 
      fontFamily: 'Arial, sans-serif', 
      fontSize: '14px', 
      maxWidth: '250px'
    }}>
      <p><strong>Room Name:</strong> {roomName}</p>
      <p><strong>Professor:</strong> {userName}</p>
      <p><strong>Time:</strong> {startTime} - {endTime}</p>
    </div>
  );
};

export default CustomTooltip;
