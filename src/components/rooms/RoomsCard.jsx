import React from "react";
import { useNavigate } from "react-router-dom";
import RoomsDescription from "./RoomsDescription";


export default function RoomsCard({ room_image, room_building, room_name, room_capacity, room_type }) {
    const navigate = useNavigate();
    
    return (
        //round-box temporary
        <div className="flex flex-col bg-white gap-4">
            <img src={room_image} alt="" className="w-80"/>
            <p className="text-gray-400">{room_building}</p>
            <h1 className="font-bold text-2xl">{room_name}</h1>
            {/*TO-DO: Add status icon*/}
            <p>Available</p>
            <button className="bg-none border-red-500 border-2 border-solid text-red-500 font-medium p-2 rounded-md w-40"
                    onClick={() => navigate("/rooms_description", 
                                {
                                    replace: true, 
                                    state: 
                                        {
                                            room_image, 
                                            room_name, 
                                            room_building, 
                                            room_capacity,
                                            room_type,
                                        } 
                                })
                            }
                >VIEW ROOM
            </button>
           
        </div>
    )
}