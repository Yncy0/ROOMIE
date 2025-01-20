import React, { useState, useEffect } from "react";
import RoomsCard from "@/components/rooms/RoomsCard";
import { Navigate } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react";
import supabase from "@/utils/supabase";
import { useFetchRooms } from "@/hooks/queries/rooms/useFetchRooms";

// export const RoomContext = React.createContext();

export default function RoomsPage() {
  const [open, setOpen] = React.useState(false);
  const { data } = useFetchRooms();

  const columns = React.useMemo(
    () => [
      {
        header: "Rooms",
        cell: ({ row }) => (
          <div className="flex flex-row justify-between">
            {data.map((item) => (
              <RoomsCard
                key={item.room_id}
                room_image={item.room_image}
                room_location={item.building.building_name}
                room_name={item.room_name}
                room_capacity={item.room_capacity}
                room_type={item.room_type}
              />
            ))}
          </div>
        ),
      },
    ],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1,
      },
    },
  });

  if (!data || data.length === 0) {
    return <div>Loading or no data available...</div>;
  }

  return (
    <>
      <div className="flex flex-col bg-white px-8 py-8 round-box gap-4">
        <h1 className="font-bold text-lg">St. Agustine Building</h1>
        <div className="flex flex-row justify-between items-center">
          <h2>Rooms</h2>
          <button
            className="rounded-3xl py-2 w-28 bg-none 
                                    text-[#1488CC] border-solid border-[#1488CC] 
                                    border-2 font-medium text-center min-w-36"
            onClick={() => setOpen(!open)}
          >
            Add Room
          </button>
          {open && <Navigate to="/rooms_add" />}
        </div>
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent">
                  <TableCell>
                    {flexRender(
                      row.getVisibleCells()[0].column.columnDef.cell,
                      row.getVisibleCells()[0].getContext()
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-row justify-end items-center">
          <button onClick={() => table.setPageIndex(0)}>
            <ChevronsLeft />
          </button>
          <button onClick={() => table.previousPage()}>
            <ChevronLeft />
          </button>
          <span className="font-bold font-roboto">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button onClick={() => table.nextPage()}>
            <ChevronRight />
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
            <ChevronsRight />
          </button>
        </div>
      </div>
    </>
  );
}
