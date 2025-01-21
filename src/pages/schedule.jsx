import { useFetchSchedule } from "@/hooks/queries/schedule/useFetchSchedule";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

export default function SchedulePage() {
  const { data } = useFetchSchedule();

  const columns = [
    { accessorKey: "days", header: "Day" },
    { accessorKey: "subject.subject_name", header: "Subject" },
    {
      accessorKey: "course",
      header: "Course",
      cell: (info) =>
        `${info.row.original.course.course_name}  ${info.row.original.course.course_year}${info.row.original.course.course_section}`,
    },
    { accessorKey: "rooms.room_name", header: "Room" },
    { accessorKey: "profiles.username", header: "User" },
    { accessorKey: "time_in", header: "Time In" },
    { accessorKey: "time_out", header: "Time Out" },
    { accessorKey: "status", header: "Status" },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}{" "}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
