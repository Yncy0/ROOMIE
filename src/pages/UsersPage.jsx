import React from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LucideFilter } from "lucide-react";
import { UserDuummy } from "@/components/users/userDummy";
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
} from "@/components/ui/table"
import { 
    ChevronRight, 
    ChevronLeft, 
    ChevronsRight,
    ChevronsLeft,
} from "lucide-react";

export default function UsersPage() {
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        setData([...UserDuummy])
    }, []);

    const columns = React.useMemo(() => [
        {
            header: 'Name', 
            accessorKey: 'name'
        },
        {
            header: 'Email', 
            accessorKey: 'email'
        },
        {
            header: 'Role', 
            accessorKey: 'role'
        },
        {
            header: 'Password', 
            accessorKey: 'password'
        },
        {
            header: 'Last Login', 
            accessorKey: 'lastLogin'
        },
        {
            header: 'Edit User', 
            accessorKey: 'editUser',
            cell: ({row}) => (
                <button className="border-solid border-2 border-[#2B32B2] py-1 w-28 text-center rounded-[50px] text-[#2B32B2] font-medium">
                    Edit
                </button>
            )
        },
        {
            header: 'Delete User', 
            accessorKey: 'delete user',
            cell: ({row}) => (
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

    return(
        <div className="flex flex-col mx-20 mt-6 gap-8">
            <div className="flex flex-row justify-between">
                <div className="flex gap-4">
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <input type="text" placeholder="Search" className="input-search min-w-[500px]"/>
                    <button className="flex flex-row items-center gap-2 text-sm px-4 border-solid border-[#E6E6E6] border-2 bg-white rounded-lg">
                        <LucideFilter width={"16px"}/>
                        Filter
                    </button>
                </div>
                <button className="bg-[#6EB229] text-white text-sm py-2 px-8 rounded-[50px]">Add User</button>
            </div>
            {/* TO-DO: TABLE!!!!!!!*/}
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
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex flex-row justify-end items-center py-4 px-14">
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
        </div>
    )
}