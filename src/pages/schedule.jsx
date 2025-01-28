import React, { useState } from "react";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import { useFetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule";

export default function SchedulePage() {
  const [roomFilter, setRoomFilter] = useState("");

  // Dummy data for demonstration purposes
  const { data, error } = useFetchSchedule();

  const filteredSchedules = roomFilter
    ? data?.filter((schedule) =>
        schedule?.rooms?.room_name
          ?.toLowerCase()
          .includes(roomFilter.toLowerCase())
      )
    : data;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weekly Schedule</h1>
      <div className="max-w-md mx-auto mb-4">
        <input
          type="text"
          placeholder="Filter by room name"
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <WeeklySchedule
        startTime="06:00"
        endTime="20:00"
        intervalMinutes={30}
        schedules={filteredSchedules}
      />
    </div>
  );
}
