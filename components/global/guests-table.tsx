"use client";

import * as React from "react";
import {
  Mail,
  Eye,
  ArrowUpDown,
  Download,
  Trash2,
  BellRing,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestDetailsDialog from "./guest-details";
import statusCounts from "@/utils/statusCount";
import DeleteGuest from "./delete-guest";
import { AddGuestModal } from "./add-guest-modal";
import ViewCommentsModal from "./view-comments-moda";
import { MessageGuest } from "./message-guest";
import { Anouncement } from "./anouncement";

type Guest = {
  _id: string;
  contact: string;
  event: string;
  createdAt: string;
  guests: {
    name: string;
    email: string;
    isAdult: boolean;
    _id: string;
  }[];
  message: string;
  name: string;
  rsvpStatus: "yes" | "no" | "maybe";
  updatedAt: string;
};

const columns: ColumnDef<Guest>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Guest Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-blue-600">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => <div>{row.getValue("contact")}</div>,
  },
  {
    accessorKey: "rsvpStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          RSVP Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("rsvpStatus") as string;
      return (
        <div
          className={
            status === "yes"
              ? "text-green-600"
              : status === "no"
              ? "text-red-600"
              : "text-yellow-600"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
  },
  {
    accessorKey: "guests",
    header: "No. Of Guest",
    cell: ({ row }) => {
      const guests = row.original.guests;
      const adults = guests.filter((guest) => guest.isAdult).length;
      const children = guests.filter((guest) => !guest.isAdult).length;
      return (
        <div className="w-max">
          Adult ({adults}) Child ({children})
        </div>
      );
    },
  },
  {
    accessorKey: "reaction",
    header: "Reaction",
    cell: ({ row }) => (
      <div className="truncate max-w-[150px]">{row.getValue("reaction")}</div>
    ),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => (
      <div className="truncate max-w-[150px]">{row.getValue("message")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* <Button size='icon' variant='ghost'>
            <Mail className='h-4 w-4' />
          </Button> */}
          <MessageGuest row={row.original} />
          <DeleteGuest row={row.original} />
          <GuestDetailsDialog guest={row.original} />
        </div>
      );
    },
  },
];

export default function GuestsTable({
  data,
  videoComments,
}: {
  data: Guest[];
  videoComments: any;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [statusFilter, setStatusFilter] = React.useState("all");

  const statusCountsData = React.useMemo(() => statusCounts(data), [data]);

  React.useEffect(() => {
    if (statusFilter === "all") {
      setColumnFilters(
        columnFilters.filter((filter) => filter.id !== "rsvpStatus")
      );
    } else {
      setColumnFilters([
        ...columnFilters.filter((filter) => filter.id !== "rsvpStatus"),
        {
          id: "rsvpStatus",
          value: statusFilter,
        },
      ]);
    }
  }, [statusFilter]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const guestsAttending = data?.filter((guest) => guest.rsvpStatus === "yes");

  const totalGuestsAttending = guestsAttending?.reduce(
    (sum, guest) => sum + guest?.guests?.length,
    0
  );

  const downloadCSV = () => {
    // Get the current filtered and sorted data
    const currentData = table.getFilteredRowModel().rows.map((row) => {
      const guest = row.original;
      return {
        Name: guest.name,
        Contact: guest.contact,
        "RSVP Status": guest.rsvpStatus,
        "Total Guests": guest.guests.length,
        Adults: guest.guests.filter((g) => g.isAdult).length,
        Children: guest.guests.filter((g) => !g.isAdult).length,
        Message: guest.message,
      };
    });

    // Convert to CSV
    const headers = Object.keys(currentData[0]);
    const csvContent = [
      headers.join(","), // Header row
      ...currentData.map((row) =>
        headers
          .map((header) =>
            // Handle special characters and quotes in the data
            JSON.stringify(row[header as keyof typeof row] || "")
          )
          .join(",")
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `guest-list-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Guest Responses ({data?.length})</CardTitle>
            <CardDescription className="pt-2">
              Total Guests with extra attendees: {totalGuestsAttending} | Adult{" "}
              {data?.reduce(
                (sum, guest) =>
                  sum +
                  (guest.rsvpStatus === "yes"
                    ? guest.guests.filter((g) => g.isAdult).length
                    : 0),
                0
              )}{" "}
              | Child{" "}
              {data?.reduce(
                (sum, guest) =>
                  sum +
                  (guest.rsvpStatus === "yes"
                    ? guest.guests.filter((g) => !g.isAdult).length
                    : 0),
                0
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Anouncement />
            <Button variant="outline" size="icon" onClick={downloadCSV}>
              <Download className="h-4 w-4" />
            </Button>
            <ViewCommentsModal videoComments={videoComments} />
            <AddGuestModal />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="flex items-center justify-start flex-wrap h-auto space-y-1 w-full">
              <TabsTrigger value="all">
                All ({statusCountsData.all})
              </TabsTrigger>
              <TabsTrigger value="yes">
                Attending ({statusCountsData.yes})
              </TabsTrigger>
              <TabsTrigger value="no">
                Not Attending ({statusCountsData.no})
              </TabsTrigger>
              <TabsTrigger value="maybe">
                Maybe ({statusCountsData.maybe})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            placeholder="Search guests by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm"
          />
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={index === 0 ? "sticky left-0 bg-white" : ""}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={index === 0 ? "sticky left-0 bg-white" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
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
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 py-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
