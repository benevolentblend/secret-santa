"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type UserWithGroup } from "~/app/users/table";

import { Checkbox } from "~/components/ui/checkbox";

export const columns: ColumnDef<UserWithGroup>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "group.name",
    header: "Group",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];
