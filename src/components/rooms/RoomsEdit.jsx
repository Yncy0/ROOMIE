import { useNavigate } from "react-router-dom"

export default function RoomsEdit() {
    const navigate = useNavigate();

    return(
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1>Edit Room</h1>
            <img src="" alt="" />
            <button />
            <label htmlFor="">Room Name</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room here"/>
            <label htmlFor="">Room Description</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room description here"/>
            <label htmlFor="">Room Capacity</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room capacity"/>
            <label htmlFor="">Room Location/Building</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room capacity"/>
            <div className="flex flex-row justify-center gap-8">
            <button onClick={() => navigate("/rooms")}
                    className="bg-gray-100 w-full text-center p-2 rounded-md"
                    >Cancel
                </button>
                <button className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md">Edit</button>
            </div>
        </div>
    )
}
    