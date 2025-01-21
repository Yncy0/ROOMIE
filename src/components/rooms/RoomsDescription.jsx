import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoomsDescription({
  room_image,
  room_name,
  room_location,
  room_capacity,
  room_type,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  room_image = location.state.room_image;
  room_name = location.state.room_name;
  room_location = location.state.room_location;
  room_capacity = location.state.room_capacity;
  room_type = location.state.room_type;

  return (
    //TO-DO: Back icon to the left
    <div className="flex flex-col round-box gap-4 min-h-full">
      <div className="flex flex-row gap-1">
        <img
          src={room_image}
          alt="image of room"
          className="max-w-[50%] min-w-[25%]"
        />
        <div className="flex flex-col gap-4">
          <h1>{room_name}</h1>
          <h2>{room_location}</h2>
          <p>{room_capacity}</p>
          <h3>Room Type</h3>
          <p>{room_type}</p>
          <button
            onClick={() =>
              navigate("/rooms_edit", {
                state: {
                  room_image,
                  room_name,
                  room_location,
                  room_capacity,
                  room_type,
                },
              })
            }
          >
            Edit Room Information
          </button>
          <button onClick={() => navigate("/rooms")}>Exit</button>
        </div>
      </div>
    </div>
  );
}
