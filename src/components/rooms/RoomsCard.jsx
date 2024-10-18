import React from "react"

//MIGHT USE PROPS
export default function RoomsCard(props) {
    const image = props.image;
    const building = props.building;
    const room = props.room;
    const status = props.status;
    
    return (
        //round-box temporary
        <div className="flex flex-col bg-white gap-4">
            <img src={image} alt="" className="w-80"/>
            <p className="text-gray-400">{building}</p>
            <h1 className="font-bold text-2xl">{room}</h1>
            {/*TO-DO: Add status icon*/}
            <p>{status}</p>
            <button className="bg-none border-red-500 border-2 border-solid text-red-500 font-medium p-2 rounded-md w-40">VIEW ROOM</button>
        </div>
    )
}