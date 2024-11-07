import React from "react";
import RoomsCard from "./RoomsCard";
import { roomDummy } from "./roomsDummy";
import { Navigate } from "react-router-dom";    
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
import { supabase } from "@/supabaseClient";

// export const RoomContext = React.createContext();

export default function RoomsTables() {
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('rooms')
                .select();

            setData(data);
        }

        fetchData();
    }, []);

    

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
                                    {data?.map((items) => (
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