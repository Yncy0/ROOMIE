import { roomDummy } from "./roomsDummy"

export default function RoomsDescription(props) {
    return(
        //TO-DO: Back icon to the left
        <div className="flex flex-col round-box gap-4">
            <div className="flex flex-row gap-1">
                <img src="" alt="" />
                <div className="flex flex-col gap-4">
                    <h1>SA Room 301</h1>
                    <h2>St. Agustine Building</h2>
                    <p>40 seats capacity</p>
                    <button>Edit Room Information</button>
                </div>
            </div>
            <h3>Room Description</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores quod vitae alias sit, vel magnam saepe quasi? Odit expedita, perferendis omnis explicabo labore tenetur eveniet atque facere ullam placeat ab?</p>
        </div>
    )
}