"use client";

import { type Prisma, type UserRole } from "@prisma/client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";
import { columns } from "~/components/user/table-columns";
import groupAction from "./table-actions/group";
import roleAction from "./table-actions/role";

export type UserWithGroup = Prisma.UserGetPayload<{
  include: {
    group: {
      select: {
        name: true;
      };
    };
  };
}>;

interface UserTableProps {
  role: UserRole;
}

const UserTable: React.FC<UserTableProps> = ({ role }) => {
  const getAllUsers = api.user.getAll.useQuery({});
  const users = getAllUsers.data ?? [];

  const actions = [roleAction, groupAction];

  return (
    <DataTable
      role={role}
      isLoading={getAllUsers.isLoading}
      columns={columns}
      data={users}
      actions={actions}
    />
  );
};

export default UserTable;
