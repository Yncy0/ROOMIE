import React from "react"


export default function RoomsCard({room_image, room_location, room_name}) {
    return (
        //round-box temporary
        <div className="flex flex-col bg-white gap-4">
            <img src={room_image} alt="" className="w-80"/>
            <p className="text-gray-400">{room_location}</p>
            <h1 className="font-bold text-2xl">{room_name}</h1>
            {/*TO-DO: Add status icon*/}
            <p>status</p>
            <button className="bg-none border-red-500 border-2 border-solid text-red-500 font-medium p-2 rounded-md w-40">VIEW ROOM</button>
        </div>
    )
}