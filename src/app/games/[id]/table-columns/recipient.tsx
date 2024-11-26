"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";

const SelectRecipient: ColumnDef<GameMatchWithUsers> = {
  header: "Recipient",
  accessorFn: (originalRow) => originalRow.recipient?.name ?? "Unassigned",
};

export default SelectRecipient;
