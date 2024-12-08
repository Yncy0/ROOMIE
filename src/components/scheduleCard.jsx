import React from "react";
import { Card, Typography } from "@mui/material";

const scheduleCard = ({ roomName, subjectCode, section, userName, time, color }) => {
  return (
    <Card
      sx={{
        padding: 1,
        borderRadius: 2,
        backgroundColor: color,
        textAlign: "center",
        minHeight: "50px",
      }}
    >
      {roomName && (
        <>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
            Prof. {userName}
          </Typography>
          <Typography sx={{ fontSize: "11px" }}>
            Subject: {subjectCode}
          </Typography>
          <Typography sx={{ fontSize: "11px" }}>
            Class: {section}
          </Typography>
          <Typography sx={{ fontSize: "11px" }}>
            Room: {roomName}
          </Typography>
          <Typography sx={{ fontSize: "10px" }}>
            Time: {time}
          </Typography>
        </>
      )}
    </Card>
  );
};

export default scheduleCard;
