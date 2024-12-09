import React, { useState, useEffect } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LucideFilter } from "lucide-react";
import supabase from "../supabaseConfig";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChevronRight,
    ChevronLeft,
    ChevronsRight,
    ChevronsLeft as ChevronsLeftIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();


    const handleEditUser = (event, user) => {
        event.stopPropagation(); // Prevent the row click event from firing
        navigate("/user_edit", { state: { user } });
    };

    const handleRowClick = (user) => {
    navigate("/user_info_sched", { state: { user } }); // Replace with your desired route
};


    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: users, error } = await supabase
                    .from('users')
                    .select('*'); // Select all columns

                if (error) {
                    console.error('Error fetching data:', error);
                    return;
                }


                setData(users);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data from Supabase:', error);
                setLoading(false);
            }
        };


        fetchData();
    }, []);

    const columns = React.useMemo(() => [
        {
            header: 'UserID',
            accessorKey: 'user_id'
        },
        {
            header: 'Name',
            accessorKey: 'user_name'
        },
        {
            header: 'Email',
            accessorKey: 'user_email'
        },
        {
            header: 'Role',
            accessorKey: 'user_role'
        },
        {
            header: 'Department',
            accessorKey: 'user_department'
        },
        {
            header: 'Last Login',
            accessorKey: 'login_time'
        },


        {
    
                header: 'Edit User',
                accessorKey: 'editUser',
                cell: ({ row }) => (
                    <button
                        onClick={(event) => handleEditUser(event, row.original)} // Pass the event
                        className="border-solid border-2 border-[#2B32B2] py-1 w-28 text-center rounded-[50px] text-[#2B32B2] font-medium"
                    >
                        Edit
                    </button>
                )
            
        },
        {
            header: 'Delete User',
            accessorKey: 'delete user',
            cell: ({ row }) => (
                <button className="border-solid border-2 border-red-500 py-1 w-28 text-center rounded-[50px] text-red-500 font-medium">
                    Delete
                </button>
            )
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    const handleAddUserClick = () => {
        setOpen(true);
        navigate("/user_add");
    };





    if (loading) {
        return <div>Loading...</div>; // Show loading text while fetching data
    }

    return (
        <div className="flex flex-col mx-20 mt-6 gap-8">
            <div className="flex flex-row justify-between">
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input type="text" placeholder="Search" className="input-search min-w-[500px]" />
                    <button className="flex flex-row items-center gap-2 text-sm px-4 border-solid border-[#E6E6E6] border-2 bg-white rounded-lg">
                        <LucideFilter width={"16px"} />
                        Filter
                    </button>
                </div>
                {/* Handle the Add User button click to navigate */}
                <button
                    onClick={handleAddUserClick}
                    className="bg-[#6EB229] text-white text-sm py-2 px-8 rounded-[50px]"
                >
                    Add User
                </button>
            </div>

            {/* TO-DO: TABLE */}
            <div className="round-box p-6">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleRowClick(row.original)} // Add the onClick handler
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
                <div className="flex flex-row justify-end items-center py-4 px-14">
                    <button onClick={() => table.setPageIndex(0)}>
                        <ChevronsLeftIcon />
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
        </div>
    );
}
