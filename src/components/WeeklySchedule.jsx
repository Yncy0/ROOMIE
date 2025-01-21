"use client";

import React from "react";
import { generateTimeSlots } from "../utils/timeUtils";

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function WeeklySchedule({
  schedules,
  startTime,
  endTime,
  intervalMinutes,
}) {
  const timeSlots = generateTimeSlots(startTime, endTime, intervalMinutes);

  const getSchedulePosition = (schedule) => {
    const startMinutes = getMinutesFromTime(schedule.time_in);
    const endMinutes = getMinutesFromTime(schedule.time_out);
    const dayIndex = weekdays.indexOf(schedule.days);

    const startTimeMinutes = getMinutesFromTime(startTime);
    const totalMinutes = getMinutesFromTime(endTime) - startTimeMinutes;

    const top = ((startMinutes - startTimeMinutes) / totalMinutes) * 100;
    const height = ((endMinutes - startMinutes) / totalMinutes) * 100;
    const left = (dayIndex / weekdays.length) * 100;
    const width = (1 / weekdays.length) * 100;

    return { top, height, left, width };
  };

  const getMinutesFromTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 30 + (minutes || 0);
  };

  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No schedules available
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Minimum width to prevent squishing */}
        <div className="relative" style={{ minHeight: "800px" }}>
          {/* Header row */}
          <div className="sticky top-0 z-10 grid grid-cols-8 gap-0 bg-white">
            <div className="p-2 bg-gray-100 border font-medium"></div>
            {weekdays.map((day) => (
              <div
                key={day}
                className="p-2 bg-gray-100 border font-medium text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="relative w-full">
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="grid grid-cols-8 gap-0 border-b"
                style={{ height: `${100 / timeSlots.length}%` }}
              >
                <div className="sticky left-0 p-2 border-l font-medium bg-white z-10">
                  {slot}
                </div>
                {weekdays.map((day) => (
                  <div
                    key={`${day}-${slot}`}
                    className="border-l min-h-[60px]"
                  ></div>
                ))}
              </div>
            ))}
          </div>

          {/* Schedule blocks */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="relative w-full h-full">
              {schedules.map((schedule, index) => {
                const { top, height, left, width } =
                  getSchedulePosition(schedule);
                // Calculate z-index based on duration - shorter events appear on top
                const zIndex = Math.floor(100 - height);

                return (
                  <div
                    key={schedule.id}
                    className="absolute bg-blue-100 p-2 rounded shadow-sm border border-blue-200 pointer-events-auto hover:z-50 transition-transform hover:scale-105"
                    style={{
                      top: `${top}%`,
                      height: `${height}%`,
                      left: `${(left * 7) / 8 + 12.5}%`, // Adjust for 8 columns (time + 7 days)
                      width: `${(width * 7) / 8}%`, // Adjust width proportionally
                      zIndex,
                    }}
                  >
                    <div className="h-full overflow-hidden">
                      <p className="font-bold text-sm truncate">
                        {schedule.subject.subject_code}
                      </p>
                      <p className="text-xs truncate">
                        {schedule.course.course_name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
