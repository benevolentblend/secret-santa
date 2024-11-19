"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";
import { type GameMatchWithUsers } from "./match-table";

export const columns: ColumnDef<GameMatchWithUsers>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="flex h-4 w-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="flex h-4 w-4"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "recipient.name",
    header: "Recipient",
  },
  {
    accessorKey: "patron.name",
    header: "Santa",
  },
];
