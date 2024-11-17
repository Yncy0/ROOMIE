import { useLocation, useNavigate } from "react-router-dom"

export default function RoomsEdit() {
    const navigate = useNavigate();
    const location = useLocation();

    async function saveData() { 
        try {
            const { data, error } = await supabase
                .from("rooms")
                .update([{
                    room_id,
                    room_name,
                    room_location,
                    room_description,
                    room_capacity,
                    room_image
                }])
                .eq('room_id', room_id);  

            if (error) throw error;

            alert("User updated successfully");
            navigate("/users"); 
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error saving user data: " + error.message);
        } 
    }

    return(
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1>Edit Room</h1>
            <img src={location.state.room_image ? location.state.room_image : "src/assets/dummy/image-placeholder.png"} alt="" />
            <button />
            <label htmlFor="">Room Name</label>
            <input 
                id="roomName" 
                className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" 
                type="text" 
                value={location.state.room_name}
                placeholder="Enter room here"
            />
            <label htmlFor="">Room Description</label>
            <input 
                id="roomDescription" 
                className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm" 
                type="text" 
                value={location.state.room_description}
                placeholder="Enter room description here"
            />
            <label htmlFor="">Room Capacity</label>
            <input 
                id="roomCapacity"
                className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" 
                type="text" 
                value={location.state.room_capacity}
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
            <button onClick={() => navigate("/rooms")}
                    className="bg-gray-100 w-full text-center p-2 rounded-md"
                    >Cancel
                </button>
                <button 
                    onClick={saveData}
                    className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md"
                    >Edit
                </button>
            </div>
        </div>
    )
}
    