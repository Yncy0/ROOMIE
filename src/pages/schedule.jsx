"use client";

import { useState } from "react";
import { WeeklySchedule } from "../components/WeeklySchedule";
import { SearchBar } from "../components/SearchBar";
import { useFetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule";

export default function SchedulePage() {
  const [selectedRoom, setSelectedRoom] = useState("");
  const { data, isLoading, error } = useFetchSchedule();

  const filteredSchedules =
    data?.filter((schedule) =>
      schedule.rooms?.room_name
        .toLowerCase()
        .includes(selectedRoom.toLowerCase())
    ) || [];

  const handleSearch = (query) => {
    setSelectedRoom(query);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Weekly Schedule</h1>
      <div className="max-w-7xl mx-auto px-4">
        <SearchBar onSearch={handleSearch} />
        {filteredSchedules.length > 0 ? (
          <WeeklySchedule
            schedules={filteredSchedules}
            startTime="08:00"
            endTime="18:00"
            intervalMinutes={60}
          />
        ) : (
          <div className="text-center mt-4">
            No schedules found for the selected room.
          </div>
        )}
      </div>
    </div>
  );
}
