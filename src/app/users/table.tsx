"use client";

import { type UserRole } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { type UserWithGroup } from "~/server/api/routers/user";

import { api } from "~/trpc/react";
import { type TableAction } from "~/components/ui/data-table-action";
import { DataTable } from "~/components/ui/data-table";

interface UserTableProps {
  role: UserRole;
  columns: ColumnDef<UserWithGroup>[];
  actions: TableAction<UserWithGroup>[];
}

const UserTable: React.FC<UserTableProps> = ({ role, columns, actions }) => {
  const getAllUsers = api.user.getAll.useQuery({});
  const users = getAllUsers.data ?? [];

  return (
    <DataTable role={role} columns={columns} data={users} actions={actions} />
  );
};

export default UserTable;
