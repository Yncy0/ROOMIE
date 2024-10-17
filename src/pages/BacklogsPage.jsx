import React from "react"
import { useTable, usePagination } from "react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backlogsDummy } from "@/components/backlogs/backlogsDummy";


export default function BacklogsPage() {
    // const [backlogs, setBacklogs] = React.useState([]);

    // React.useMemo(() => [
    //     ...backlogsDummy
    // ], [])

    const columns = React.useMemo(() => [
        {Header: 'Date', accessor: 'date'},
        {Header: 'Logs', accessor: 'logs'},
        {Header: 'Time', accessor: 'time'}
    ], [])

    

    return(
        //TO-DO: Fix the variable later
        //TO-DO: 
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
        <div className="p-4">
            <Table {...getTableProps} className="w-full">
                <TableHeader>
                    {headerGroups.map(headerGroup => (
                        <TableRow {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <TableHead {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
            </Table>
        </div>

    )
}