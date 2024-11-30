"use client";

import Link from "next/link";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "~/components/ui/checkbox";
import Avatar from "~/components/user/avatar";

import { type UserWithGroup } from "./table";

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
    header: "Profile",
    cell: ({ row }) => (
      <Link href={`/users/${row.original.id}`}>
        <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50">
          <Avatar user={row.original} />
          <p>{row.original.name}</p>
        </div>
      </Link>
    ),
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
