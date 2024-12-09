import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function RoomsDescription( {room_image, room_name, room_building, room_capacity, room_type } ) {
    const navigate = useNavigate();
    const location = useLocation(); 

    room_image = location.state.room_image;
    room_name = location.state.room_name;
    room_building = location.state.room_building;
    room_capacity = location.state.room_capacity;
    room_type = location.state.room_type;
    


    return(
        //TO-DO: Back icon to the left
        <div className="flex flex-col round-box gap-4">
            <div className="flex flex-row gap-1">
                <img src={room_image} alt="" />
                <div className="flex flex-col gap-4">
                    <h1>{room_name}</h1>
                    <h2>{room_building}</h2>
                    <p>{room_capacity}</p>
                    <button 
                        onClick={() => navigate("/rooms_edit", 
                                {state: 
                                    {
                                        room_image, 
                                        room_name,
                                        room_building,
                                        room_capacity,
                                        room_type
                                    }
                                })}>Edit Room Information</button>
                    <button onClick={() => navigate("/rooms")}>Exit</button>
                </div>
            </div>
            <h3>Room Description</h3>
            <p>{room_type}</p>
        </div>
    )
}