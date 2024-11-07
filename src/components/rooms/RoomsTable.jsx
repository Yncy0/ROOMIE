import React from "react";
import RoomsCard from "./RoomsCard";
import { roomDummy } from "./roomsDummy";
import { Navigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { 
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { 
    ChevronRight, 
    ChevronLeft, 
    ChevronsRight,
    ChevronsLeft,
} from "lucide-react";

// export const RoomContext = React.createContext();

const supabase = createClient("https://vjvuhazfxkuqegqlkums.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqdnVoYXpmeGt1cWVncWxrdW1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjYzNTEsImV4cCI6MjA0NjMwMjM1MX0.Zhr4aS-oVOhWkHsV9_8s2X1ocxr7CVfrXrc8rfx2n84");

export default function RoomsTables() {
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        getData(
            // ...roomDummy
        );  
    }, []);

    async function getData() {
        const {data, error }= await supabase.from("rooms").select();
        setData(data);
    }

    const table = useReactTable({
        data,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    return (
        //TO-DO: Avoid too much props para
        <>
            <div className="flex flex-col bg-white px-8 py-8 round-box gap-4">
                <h1 className="font-bold text-lg">St. Agustine Building</h1>
                <div className="flex flex-row justify-between items-center">
                    <h2>Rooms</h2>
                    <button className="rounded-3xl py-2 w-28 bg-none 
                                    text-[#1488CC] border-solid border-[#1488CC] 
                                    border-2 font-medium text-center min-w-36"
                            onClick={() => (setOpen(!open))}
                    >Add Room
                    </button>
                    {open && (<Navigate to="/rooms_add"/>)}
                </div>
                <Table>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell>
                                <div className="flex flex-row justify-between">
                                    {data.map((items) => (
                                        <RoomsCard 
                                            key={items.room_id}
                                            image={items.room_image} 
                                            building={items.room_location} 
                                            room={items.room_name} 
                                            // status={items.status}
                                        />
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div className="flex flex-row justify-end items-center">
                    <button onClick={() => table.setIndexPage(0)}>
                        <ChevronsLeft/>
                    </button>
                    <button onClick={() => table.previousPage()}>
                        <ChevronLeft/>
                    </button>
                    <span className="font-bold font-roboto">
                        {table.getState().pagination.pageIndex + 1}
                    </span>
                    <button onClick={() => table.nextPage()}>
                        <ChevronRight/>
                    </button>
                    <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                        <ChevronsRight/>
                    </button>
                </div>
            </div>
            
            {/*DESCRIPTION LOADER*/}
            {/* {data.map((element, _) => (
                <RoomsDescription image={element.image} room={element.room} building={element.building} seats={element.seats} description={element.description}/>
            ))} */}
        </>
    );
}