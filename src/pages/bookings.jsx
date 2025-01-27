"use client";

import { useFetchBookedRooms } from "@/hooks/queries/bookedRooms/useFetchBookedRooms";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";

const BookingsPage = () => {
  const { data, isLoading, error } = useFetchBookedRooms();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
                <TableCell>{booking.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BookingsPage;
