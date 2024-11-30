"use client";

import Link from "next/link";

import type { ColumnDef } from "@tanstack/react-table";

import { type GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";
import Avatar from "~/components/user/avatar";

const Recipient: ColumnDef<GameMatchWithUsers> = {
  header: "Recipient",
  cell: ({ row }) => {
    if (!row.original.recipient) return "Unassigned";

    return (
      <Link href={`/users/${row.original.recipientId}`}>
        <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50">
          <Avatar user={row.original.recipient} />
          <p>{row.original.recipient.name}</p>
        </div>
      </Link>
    );
  },
};

export default Recipient;
