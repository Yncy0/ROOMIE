import RoomsAdd from "@/components/rooms/RoomsAdd";
import RoomsTables from "@/components/rooms/roomsTable";


export default function RoomsPages() {
    return(
        <>
            <h1>ROOMS</h1>
            <RoomsTables />
            <RoomsAdd />
        </>
    )
}