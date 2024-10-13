import React from "react"
import { Navigate } from "react-router-dom";

export default function RoomsAdd() {
    const [close, setClose] = React.useState(false);

    return(
        <div className="round-box flex flex-col bg-white gap-4 p-4">
            <h1 className="text-center font-bold text-lg">Create New Room</h1>
            <div className="flex justify-center">
                <img src="src/assets/dummy/image-placeholder.png" 
                    alt=""
                    className="object-cover w-64" 
                />
            </div>
            <button />
            <label htmlFor="">Room Name</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room here"/>
            <label htmlFor="">Room Description</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 pb-32 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room description here"/>
            <label htmlFor="">Room Capacity</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room capacity"/>
            <label htmlFor="">Room Location/Building</label>
            <input className="bg-none border-solid border-2 border-gray-300 p-2 rounded-md text-sm" type="text" name="" id="" placeholder="Enter room capacity"/>
            <div className="flex flex-row justify-center gap-8 w-full">
                <button onClick={() => setClose(!close)}
                        className="bg-gray-100 w-full text-center p-2 rounded-md">Cancel
                </button>
                {close && (<Navigate to="/rooms" />)}
                <button className="bg-[#2B32B2] text-white w-full text-center p-2 rounded-md">Create</button>
            </div>
        </div>
    )
}
    