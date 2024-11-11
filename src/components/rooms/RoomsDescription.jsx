import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function RoomsDescription({ room_name, room_location, room_capacity}) {
    const navigate = useNavigate();
    const location = useLocation(); 
    console.log(location.state.room_image);

    return(
        //TO-DO: Back icon to the left
        <div className="flex flex-col round-box gap-4">
            <div className="flex flex-row gap-1">
                <img src={location.state.room_image} alt="" />
                <div className="flex flex-col gap-4">
                    <h1>{location.state.room_name}</h1>
                    <h2>{room_location}</h2>
                    <p>{room_capacity}</p>
                    <button>Edit Room Information</button>
                    <button onClick={navigate("/rooms")}>Exit</button>
                </div>
            </div>
            <h3>Room Description</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem alias porro sed provident in deleniti, nihil nobis maxime cumque, magni illo neque? Aperiam praesentium itaque repudiandae velit numquam quisquam eum.</p>
        </div>
    )
}