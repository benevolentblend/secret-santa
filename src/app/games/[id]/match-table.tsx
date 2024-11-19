"use client";

import { type Prisma, type UserRole } from "@prisma/client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "./table-columns";

export type GameMatchWithUsers = Prisma.GameMatchGetPayload<{
  include: {
    patron: true;
    recipient: true;
  };
}>;

interface UserTableProps {
  role: UserRole;
  id: number;
}

const MatchTable: React.FC<UserTableProps> = ({ role, id }) => {
  // const getMatches = api.game.getMatches.useQuery({ id });
  const getMatches = api.game.getMatches.useQuery({ id });
  const matches = getMatches.data ?? [];

  return (
    <DataTable
      role={role}
      isLoading={getMatches.isLoading}
      columns={columns}
      data={matches}
    />
  );
};

export default MatchTable;
