import React, { useState, useMemo, useEffect } from "react";
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
  ChevronsLeft as ChevronsLeftIcon,
} from "lucide-react";
import { useFetchRooms } from "@/hooks/queries/rooms/useFetchRooms";

export default function RoomsPage() {
  const [open, setOpen] = useState(false);
  const { data = [], isLoading, error } = useFetchRooms();
  const [showLoader, setShowLoader] = useState(true); // Initially show loader when page loads

  const roomsPerRow = 3; // Show 3 rooms per row

  // Create columns dynamically based on your data shape
  const columns = useMemo(() => [
    {
      header: "Rooms",
      accessorKey: "rooms", // This will serve as the key for your data row
      cell: ({ row }) => (
        <div className="flex flex-row justify-between gap-4">
          {row.original.rooms.map((item) => (
            <RoomsCard
              key={item.id}
              id={item.id}
              room_image={item.room_image}
              room_location={item.building?.building_name}
              room_name={item.room_name}
              room_capacity={item.room_capacity}
              room_type={item.room_type}
              building_id={item.building?.building_id}
            />
          ))}
        </div>
      ),
    },
  ], []);

  // Paginate data - group rooms into sets of 3 per row
  const paginatedData = useMemo(() => {
    const totalPages = Math.ceil(data.length / roomsPerRow);
    return Array.from({ length: totalPages }, (_, pageIndex) => {
      const start = pageIndex * roomsPerRow;
      const roomsForRow = data.slice(start, start + roomsPerRow);
      return {
        rooms: roomsForRow,
      };
    });
  }, [data, roomsPerRow]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 1, // Display only one row per page
      },
    },
  });

  // Simulate loading for pagination (1 second delay)
  const handlePagination = (action) => {
    setShowLoader(true); // Show loader on pagination action
    setTimeout(() => {
      if (action === "first") table.setPageIndex(0);
      else if (action === "prev") table.previousPage();
      else if (action === "next") table.nextPage();
      else if (action === "last") table.setPageIndex(table.getPageCount() - 1);
      
      setShowLoader(false); // Hide loader after a delay
    }, 1000); // Simulate 1 second delay for loading
  };

  useEffect(() => {
    // Set showLoader to false once the data is loaded after initial fetch
    if (!isLoading && data.length > 0) {
      setShowLoader(false);
    }
  }, [isLoading, data]);

  if (error) {
    return <div>Error loading rooms</div>;
  }

  return (
    <div
    className="flex flex-col px-8 py-8 round-box gap-2 mx-auto my-5 w-[95%]"
    style={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(20px) saturate(120%) contrast(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(120%) contrast(120%)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '15px',
    }}
    >
    
    <div className="flex flex-row justify-between items-center">
     <h1 className="font-bold text-lg text-[#35487a]">Rooms</h1>
        {/*Add Room Button*/}
        <button
          className="flex items-center justify-center text-[#35487a] bg-transparent border-2 border-solid 
          border-[#35487a] rounded-lg py-2 px-8 text-sm font-medium cursor-pointer transition-colors duration-300 
          hover:bg-[#35487a] hover:text-white mt-4"
          onClick={() => setOpen(true)}
        >
          Add Room
        </button>

        {open && <Navigate to="/rooms_add" />}
    </div>

    {/* Loading State - 3 columns skeleton loader */}
    {showLoader ? (
      <div className="grid grid-cols-3 gap-4 mb-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="relative flex flex-col w-80 rounded-xl bg-white p-6 gap-4 animate-pulse"
            >
        {/* Image Skeleton */}
        <div className="h-40 bg-gray-300 rounded-xl mb-4"></div>

        {/* Room Details Skeleton */}
        <div>
        <div className="h-4 bg-gray-200 rounded-full mb-2"></div> {/* Room Name */}
        <div className="h-3 bg-gray-200 rounded-full w-3/4"></div> {/* Location */}
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-300 rounded-lg w-40 mt-4"></div> {/* Button */}
        </div>
        ))}
      </div>
      ) : (
    <Table>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow
          key={row.id}
          className="bg-transparent focus:ring-0 focus:outline-none hover:bg-transparent"
          >
            <TableCell>
              {flexRender(
              row.getVisibleCells()[0].column.columnDef.cell,
              row.getVisibleCells()[0].getContext()
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-row justify-end items-center py-4 px-14 gap-2">
        <button
          onClick={() => handlePagination("first")}
          disabled={!table.getCanPreviousPage()}
          className={`p-2 rounded ${!table.getCanPreviousPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronsLeftIcon />
        </button>

        <button
          onClick={() => handlePagination("prev")}
          disabled={!table.getCanPreviousPage()}
          className={`p-2 rounded ${!table.getCanPreviousPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronLeft />
        </button>

        <span className="font-bold font-roboto px-4 text-[#35487a]">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        
        <button
          onClick={() => handlePagination("next")}
          disabled={!table.getCanNextPage()}
          className={`p-2 rounded ${!table.getCanNextPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronRight />
        </button>
  
        <button
          onClick={() => handlePagination("last")}
          disabled={!table.getCanNextPage()}
          className={`p-2 rounded ${!table.getCanNextPage() ? "text-gray-400" : " text-[#35487a]"}`}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}
