import React from "react";
import RoomsCard from "./RoomsCard";
import RoomsDescription from "./RoomsDescription";
import { roomDummy } from "./roomsDummy";
import { Link, Navigate } from "react-router-dom";


export const RoomContex = React.createContext();

export default function RoomsTables() {
    const [rooms, setRooms] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setRooms([
            ...roomDummy
        ])
    }, [])

    return (
        //TO-DO: Avoid too much props param
        <>
            <div className="flex flex-col bg-white px-8 py-8 round-box gap-4">
                <h1 className="font-bold text-lg">St. Agustine Building</h1>
                <div className="flex flex-row justify-between items-center">
                    <h2>Rooms</h2>
                    <button className="rounded-3xl p-3 w-28 bg-none 
                                    text-[#1488CC] border-solid border-[#1488CC] 
                                    border-2 font-bold text-center min-w-36"
                            onClick={() => setOpen(!open)}
                                    >
                                    Add Room
                    </button>
                    {open && (<Navigate to="/rooms/rooms_add"/>)}
                </div>
                <ul className="flex flex-row gap-4 justify-between">
                    {rooms.map((element, index) => (
                        <li key={index}>
                            <RoomsCard image={element.image} building={element.building} room={element.room} status={element.status}/>
                        </li>
                    ))}
                </ul>
            </div>
            {/*DESCRIPTION LOADER*/}
            {rooms.map((element, _) => (
                <RoomsDescription image={element.image} room={element.room} building={element.building} seats={element.seats} description={element.description}/>
            ))}
        </>
    );
}