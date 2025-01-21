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
  startTime = "09:00",
  endTime = "17:00",
  intervalMinutes = 30,
}) {
  const timeSlots = generateTimeSlots(startTime, endTime, intervalMinutes);

  const getScheduleForSlot = (day, time) => {
    return schedules.find(
      (schedule) =>
        schedule.days === day &&
        schedule.time_in <= time &&
        schedule.time_out > time
    );
  };

  return (
    <div className="container mx-auto p-4 overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100"></th>
            {weekdays.map((day) => (
              <th key={day} className="border p-2 bg-gray-100">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td className="border p-2 font-medium">{slot}</td>
              {weekdays.map((day) => {
                const schedule = getScheduleForSlot(day, slot);
                return (
                  <td key={`${day}-${slot}`} className="border p-2">
                    {schedule && (
                      <div className="bg-blue-100 p-1 rounded">
                        <p className="font-bold">{schedule.course.name}</p>
                        <p>{schedule.subject.subject_name}</p>
                        {/* <p>{schedule.profiles.username}</p> */}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
