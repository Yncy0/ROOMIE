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
  startTime = "06:00",
  endTime = "20:00",
  intervalMinutes = 60,
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
    const [hours, minutes] = time?.split(":").map(Number);
    return hours * 60 + minutes;
  };

  if (!schedules || schedules.length === 0) {
    console.warn("No schedules provided to WeeklySchedule component");
    return <div>No schedules available</div>;
  }

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
      <div className="relative w-full" style={{ minHeight: "800px" }}>
        {/* Header row */}
        <div className="grid grid-cols-8 gap-0 mb-2">
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
        <div className="absolute top-0 left-0 w-full h-full">
          {timeSlots.map((slot) => (
            <div
              key={slot}
              className="grid grid-cols-8 gap-0 border-b"
              style={{ height: `${100 / timeSlots.length}%` }}
            >
              <div className="p-2 border-l font-medium">{slot}</div>
              {weekdays.map((day) => (
                <div key={`${day}-${slot}`} className="border-l"></div>
              ))}
            </div>
          ))}
        </div>

        {/* Schedule blocks */}
        <div className="absolute top-0 left-0 w-full h-full">
          {schedules.map((schedule) => {
            const { top, height, left, width } = getSchedulePosition(schedule);
            return (
              <div
                key={schedule.id}
                className="absolute bg-blue-100 p-2 rounded shadow-sm border border-blue-200"
                style={{
                  top: `${top}%`,
                  height: `${height}%`,
                  left: `${left + 12.5}%`, // Adjust for the time column
                  width: `${width}%`,
                }}
              >
                <div className="h-full overflow-hidden">
                  <p className="font-bold truncate">
                    {schedule.course.course_name}
                  </p>
                  <p className="truncate">{schedule.subject.subject_name}</p>
                  {/* <p className="truncate">{schedule.profiles.username}</p> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
