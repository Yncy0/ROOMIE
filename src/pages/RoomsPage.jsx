import RoomsAdd from "@/components/rooms/RoomsAdd";
import RoomsDescription from "@/components/rooms/RoomsDescription";
import RoomsEdit from "@/components/rooms/RoomsEdit";
import RoomsTables from "@/components/rooms/roomsTable";


export default function RoomsPages() {
    return(
        <div className="mx-20 flex flex-col gap-8">
            <h1>ROOMS</h1>
            <RoomsTables />
            <RoomsDescription />
            <RoomsAdd />
            <RoomsEdit />
        </div>
    )
}