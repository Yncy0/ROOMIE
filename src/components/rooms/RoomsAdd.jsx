import React from "react"
import { Navigate } from "react-router-dom";

export default function RoomsAdd() {
    const [close, setClose] = React.useState(false);

    return(
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1>Create New Room</h1>
            <img src="" alt="" />
            <button />
            <label htmlFor="">Room Name</label>
            <input type="text" name="" id="" placeholder="Enter room here"/>
            <label htmlFor="">Room Description</label>
            <input type="text" name="" id="" placeholder="Enter room description here"/>
            <label htmlFor="">Room Capacity</label>
            <input type="text" name="" id="" placeholder="Enter room capacity"/>
            <label htmlFor="">Room Location/Building</label>
            <input type="text" name="" id="" placeholder="Enter room capacity"/>
            <div className="flex flex-row justify-center gap-8">
                <button onClick={() => setClose(!close)}>Cancel</button>
                {close && (<Navigate to="/rooms" />)}
                <button>Add</button>
            </div>
        </div>
    )
}
    