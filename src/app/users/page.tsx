import UserTable from "~/app/users/table";
import groupAction from "~/components/user/table-actions/group";
import roleAction from "~/components/user/table-actions/role";
import { columns } from "~/components/user/table-columns";

import { getSessionRole } from "~/server/auth";

export default async function Page() {
  const role = await getSessionRole();
  const actions = [roleAction, groupAction];

  return (
    <div className="container mx-auto py-10">
      <UserTable role={role} actions={actions} columns={columns} />
    </div>
  );
}
