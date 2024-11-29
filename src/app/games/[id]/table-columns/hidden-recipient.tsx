"use client";

import Avatar from "~/components/user/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { type GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";
import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const HiddenRecipientItem: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [shown, setShown] = useState(false);

  return (
    <div className="flex items-center">
      <Button variant="outline" onClick={() => setShown(!shown)}>
        {shown ? <EyeIcon /> : <EyeOffIcon />}
      </Button>
      <div className={cn(!shown && "invisible")}>{children}</div>
    </div>
  );
};

const HiddenRecipient: ColumnDef<GameMatchWithUsers> = {
  header: "Hidden Recipient",
  cell: ({ row }) => {
    if (!row.original.recipient) return "Unassigned";

    return (
      <HiddenRecipientItem>
        <Link href={`/users/${row.original.recipientId}`}>
          <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-muted/50">
            <Avatar user={row.original.recipient} />
            <p>{row.original.recipient.name}</p>
          </div>
        </Link>
      </HiddenRecipientItem>
    );
  },
};

export default HiddenRecipient;
