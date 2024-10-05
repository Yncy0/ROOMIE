import RoomsCard from "./RoomsCard";


export default function RoomsTables() {
    return (
        <div className="flex flex-col bg-white p-4 round-box gap-4">
            <h1>St. Agustine Building</h1>
            <div className="flex flex-row justify-between">
                <h2>Rooms</h2>
                <button>Add</button>
            </div>
            <div className="flex flex-row gap-4">
                <RoomsCard/>
                <RoomsCard/>
                <RoomsCard/>
                <RoomsCard/>
            </div>
        </div>
    );
}