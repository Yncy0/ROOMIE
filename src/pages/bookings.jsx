"use client";

import { useFetchBookedRooms } from "@/hooks/queries/bookedRooms/useFetchBookedRooms";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReactDOM from "react-dom";
import Modal from "react-modal";

import dayjs from "dayjs";
import { useUpdateBookedRooms } from "@/hooks/queries/bookedRooms/useUpdateBookedRooms";
import { sendSms } from "@/utils/sendSMS";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const BookingsPage = () => {
  let subtitle;
  const { data, isLoading, error } = useFetchBookedRooms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  function openModal() {
    setIsModalOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  const handleStatusClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booked Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Room Name</TableHead>
              <TableHead>Course & Section</TableHead>
              <TableHead>Subject Code</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  {dayjs(booking.time_in).format("HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {dayjs(booking.time_out).format("HH:mm:ss")}
                </TableCell>
                <TableCell>{booking.profiles?.username}</TableCell>
                <TableCell>{booking.rooms?.room_name}</TableCell>
                <TableCell>{booking.course_and_section}</TableCell>
                <TableCell>{booking.subject_code}</TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => handleStatusClick(booking)}
                  >
                    {booking.status}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal
          isOpen={isModalOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          contentLabel="Example Modal"
          style={customStyles}
        >
          <div className="w-full flex flex-col gap-5">
            <div>
              <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Permission</h2>
              <p>{`Do you want to grant access the status: ${selectedBooking?.status} on ${selectedBooking?.profiles.username}?`}</p>
            </div>
            <div className="flex flex-row gap-4">
              <button
                onClick={async () => {
                  useUpdateBookedRooms("ON GOING", selectedBooking?.id);
                  sendSms();
                }}
              >
                Yes
              </button>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};

export default BookingsPage;
