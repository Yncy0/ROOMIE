import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@mui/material';

const PrintablePage = ({ selectedUser, userInfo, scheduleData }) => {
  return (
    <div className="printable-page">
      {/* User Information PRINT */}
      <Typography variant="h1" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        {selectedUser} Information
      </Typography>
      
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}></Typography>
          <div style={{ marginTop: "20px" }}>
            <p><strong>Name:</strong> {selectedUser}</p>
            <p><strong>ID:</strong> {userInfo?.user_id || "Unknown ID"}</p>
            <p><strong>Email:</strong> {userInfo?.user_email || "Unknown Email"}</p>
            <p><strong>Department:</strong> {userInfo?.user_department || "Unknown Department"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Table PRINT */}
      <Card>
        <CardContent>
          <Typography variant="h1" sx={{ fontWeight: "bold" }}>Schedule Information</Typography>
          <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
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
                    <TableRow key={index} >
                      <TableCell>{event.room_name}</TableCell>
                      <TableCell>{event.subject_code}</TableCell>
                      <TableCell>{event.course_name}</TableCell>
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

      {/* CSS for PRINT */}
      <style>
        {`
          /* Hide the content on screen */
          .printable-page {
            display: none;
          }

          /* Show the content when printing */
          @media print {
            .printable-page {
              display: block;
            }

            .printable-page table {
              width: 100%;
              border-collapse: collapse;
            }

            .printable-page th, .printable-page td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }

            .printable-page th {
              background-color: #f2f2f2;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PrintablePage;
