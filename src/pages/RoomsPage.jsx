import RoomsAdd from "@/components/rooms/RoomsAdd";
import RoomsDescription from "@/components/rooms/RoomsDescription";
import RoomsEdit from "@/components/rooms/RoomsEdit";
import RoomsTables from "@/components/rooms/roomsTable";


export default function RoomsPages() {
    return(
        <>
            <h1>ROOMS</h1>
            <RoomsTables />
            <RoomsDescription />
            <RoomsAdd />
            <RoomsEdit />
        </>
    )
}