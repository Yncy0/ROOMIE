import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoomsCard({
  id,
  room_image,
  room_location,
  room_name,
  room_capacity,
  room_type,
  building_id,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white gap-4">
      <img src={room_image} alt="" className="w-80" />
      <p className="text-gray-400">{room_location}</p>
      <h1 className="font-bold text-2xl">{room_name}</h1>
      <p>Available</p>
      <button
        className="bg-none border-red-500 border-2 border-solid text-red-500 font-medium p-2 rounded-md w-40"
        onClick={() =>
          navigate(`/rooms_description/${id}`, {
            replace: true,
            state: {
              id,
              room_image,
              room_name,
              room_type,
              room_location,
              room_capacity,
              building_id,
            },
          })
        }
      >
        VIEW ROOM
      </button>
    </div>
  );
}
