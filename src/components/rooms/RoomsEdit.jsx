import { useUpdateBuilding } from "@/hooks/queries/building/useUpdateBuilding";
import { useUpdateRooms } from "@/hooks/queries/rooms/useUpdateRooms";
import { useLocation, useNavigate } from "react-router-dom";

export default function RoomsEdit() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    room_image,
    room_name,
    room_location,
    room_capacity,
    room_type,
    building_id,
  } = state;

  const updateRooms = useUpdateRooms(
    room_name,
    room_image,
    room_type,
    room_capacity,
    building_id
  );

  const updateBuilding = useUpdateBuilding(room_location);

  const onHandleUpdate = () => {
    if (updateRooms && updateBuilding) {
      updateRooms;
      updateBuilding;

      alert("Data saved successfully");
      navigate("/rooms");
    }
  };

  return (
    <div className="round-box flex flex-col bg-white gap-4 p-4">
      <h1>Edit Room</h1>
      <img
        src={room_image ? room_image : "src/assets/dummy/image-placeholder.png"}
        alt=""
      />
      <button />
      <label htmlFor="">Room Name</label>
      <input
        id="roomName"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        value={room_name}
        placeholder="Enter room here"
      />
      <label htmlFor="">Room Type</label>
      <input
        id="roomDescription"
        className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm"
        type="text"
        value={room_type}
        placeholder="Enter room description here"
      />
      <label htmlFor="">Room Capacity</label>
      <input
        id="roomCapacity"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        value={room_capacity}
        placeholder="Enter room capacity"
      />
      <label htmlFor="">Room Location/Building</label>
      <input
        id="roomLocation"
        className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm"
        type="text"
        name=""
        placeholder="Enter room capacity"
      />
      <div className="flex flex-row justify-center gap-8">
        <button
          onClick={() => navigate("/rooms")}
          className="bg-gray-100 w-full text-center p-2 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={onHandleUpdate}
          className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
