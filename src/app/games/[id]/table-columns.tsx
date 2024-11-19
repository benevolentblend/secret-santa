"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type GameMatchWithUsers } from "./match-table";

export const columns: ColumnDef<GameMatchWithUsers>[] = [
  {
    accessorKey: "recipient.name",
    header: "Recipient",
  },
  {
    accessorKey: "patron.name",
    header: "Santa",
  },
];
