import { type ColumnDef } from "@tanstack/react-table";

import { type Game } from "@prisma/client";

export const columns: ColumnDef<Game>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
];
