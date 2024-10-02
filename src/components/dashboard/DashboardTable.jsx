import { useState } from "react"
export default function DashbaordTable() {
    const [rooms, setRooms] = useState("St. Agustine Bldg.")

    return(
        <div className="dashboard-table round-box">
            <h1>Top Booked Rooms</h1>
            <h3>Rooms</h3>
            <h3>Times Booked</h3>
            <h3>Cancelled</h3>
        </div>
    )
}