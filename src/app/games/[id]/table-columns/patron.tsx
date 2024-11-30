"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { type GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";
import Avatar from "~/components/user/avatar";

const PatronColumn: ColumnDef<GameMatchWithUsers> = {
  id: "patron",
  header: "Patron",
  cell: ({ row }) => (
    <Link href={`/users/${row.original.patronId}`}>
      <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50">
        <Avatar user={row.original.patron} />
        <p>{row.original.patron.name}</p>
      </div>
    </Link>
  ),
};

export default PatronColumn;
