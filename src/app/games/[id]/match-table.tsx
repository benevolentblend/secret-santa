"use client";

import { type Prisma, type UserRole } from "@prisma/client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { GameMatchWithUsers } from "~/components/game/use-batch-update-recipients";

interface UserTableProps {
  role: UserRole;
  id: number;
  columns: ColumnDef<GameMatchWithUsers>[];
}

const MatchTable: React.FC<UserTableProps> = ({ role, id, columns }) => {
  const getMatches = api.game.getMatches.useQuery({ id });
  const matches = getMatches.data ?? [];
  const initialSorting = [
    {
      id: "patron",
      desc: false,
    },
  ];

  return (
    <DataTable
      role={role}
      columns={columns}
      data={matches}
      initialSorting={initialSorting}
    />
  );
};

export default MatchTable;
