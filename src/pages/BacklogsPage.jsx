import React from "react"
import { backlogsDummy } from "@/components/backlogs/backlogsDummy";
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

export default function BacklogsPage() {
    const [data, setData] = React.useState([])

    React.useEffect(() => {
        setData(backlogsDummy); 
    }, [])

    // const data = React.useMemo(() => backlogsDummy, [])
    const columns = React.useMemo(() => [
        { header: 'Date', accessorKey: 'date' },
        { header: 'Logs', accessorKey: 'logs' },
        { header: 'Time', accessorKey: 'time' }
    ], []);
    // const columns = [
    //     {header: 'Date', accessorKey: 'date'},
    //     {header: 'Logs', accessorKey: 'logs'},
    //     {header: 'Time', accessorKey: 'time'}
    // ]
    
    const table = useReactTable({
        data, 
        columns, 
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    return(
        //TO-DO: Fix the variable later
        //TO-DO: 

        <div className="round-box mx-20 mt-6 font-roboto">
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

        // <div className="p-4 flex justify-center">
        //     <table className>
        //         {table.getHeaderGroups().map(headerGroup => (
        //             <tr key={headerGroup.id}>
        //                 {headerGroup.headers.map(header => 
        //                 <th key={header.id} colSpan={header.colSpan} className="w-60 text-start">
        //                     {flexRender(header.column.columnDef.header, header.getContext())}
        //                 </th>
        //             )}
        //             </tr>
        //         ))}
        //         <tbody>
        //             {table.getRowModel().rows.map((row) => (
        //                 <tr key={row.id}>
        //                     {row.getVisibleCells().map((cell) => (
        //                         <td key={cell.id}>
        //                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
        //                         </td>
        //                     ))}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    )
}