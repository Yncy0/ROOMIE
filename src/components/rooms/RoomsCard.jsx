import React from "react"

//MIGHT USE PROPS
export default function RoomsCard(props) {
    const image = props.image;
    const building = props.building;
    const room = props.room;
    const status = props.status;
    
    return (
        //round-box temporary
        <div className="flex flex-col bg-white round-box gap-4">
            <img src={image} alt="" className="w-64"/>
            <p>{building}</p>
            <h1>{room}</h1>
            <p>{status}</p>
            <button>View Room</button>
        </div>
    )
}