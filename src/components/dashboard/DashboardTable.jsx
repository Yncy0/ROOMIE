import { useState } from "react"
export default function DashbaordTable() {
    const [rooms, setRooms] = useState([]);
    const [roomName, setRoomName] = useState("");

    return(
        <div className="flex flex-col p-4 bg-white shadow-xl rounded-md">
             <h1>Top Booked Rooms</h1>
            <div className="flex flex-row justify-between">
                <h3>Rooms</h3>
                <h3>Times Booked</h3>
                <h3>Cancelled</h3>
            </div>
            <ul>
                {rooms.map((element, index) => {
                    <li key={index}>
                        <p>{element}</p>
                    </li>
                })}
            </ul>
        </div>
    )
}