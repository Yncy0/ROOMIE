import RoomsAdd from "@/components/rooms/RoomsAdd";
import RoomsDescription from "@/components/rooms/RoomsDescription";
import RoomsEdit from "@/components/rooms/RoomsEdit";
import RoomsTables from "@/components/rooms/roomsTable";
import { Outlet } from "react-router-dom";


export default function RoomsPages() {
    return(
        <div className="mx-20 mt-6 flex flex-col gap-8">
            <RoomsTables />
            {/* <RoomsDescription /> */}
            
        </div>
    )
}