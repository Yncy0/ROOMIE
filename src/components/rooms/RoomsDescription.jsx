import React from "react";

export default function RoomsDescription(props) {
    const image = props.image;
    const building = props.building;
    const room = props.room;
    const seats = props.seats;
    const description = props.description

    return(
        //TO-DO: Back icon to the left
        <div className="flex flex-col round-box gap-4">
            <div className="flex flex-row gap-1">
                <img src={image} alt="" />
                <div className="flex flex-col gap-4">
                    <h1>{room}</h1>
                    <h2>{building}</h2>
                    <p>{seats}</p>
                    <button>Edit Room Information</button>
                </div>
            </div>
            <h3>Room Description</h3>
            <p>{description}</p>
        </div>
    )
}