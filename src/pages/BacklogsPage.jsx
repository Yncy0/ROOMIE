import React from "react"
// import { useTable, usePagination } from "react-table";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backlogsDummy } from "@/components/backlogs/backlogsDummy";


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
    
    const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel()})

    return(
        //TO-DO: Fix the variable later
        //TO-DO: 
        <div>
            <table>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => 
                        <th key={header.id} colSpan={header.colSpan}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    )}
                    </tr>
                ))}
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        // <div className="flex flex-col gap-4 round-box">
        //     <ul>
        //        {backlogs.map((element, index) => (
        //             <li className="flex flex-row justify-around" key={index}>
        //                 <p>{element.date}</p>
        //                 <p>{element.logs}</p>
        //                 <p>{element.time}</p>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        // <div className="p-4">
        //     <Table {...getTableProps} className="w-full">
        //         <TableHeader>
        //             {headerGroups.map(headerGroup => (
        //                 <TableRow {...headerGroup.getHeaderGroupProps()}>
        //                     {headerGroup.headers.map(column => (
        //                         <TableHead {...column.getHeaderProps()}>
        //                             {column.render('Header')}
        //                         </TableHead>
        //                     ))}
        //                 </TableRow>
        //             ))}
        //         </TableHeader>
        //     </Table>
        // </div>

    )
}