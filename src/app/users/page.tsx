import { DataTable } from "~/components/ui/data-table";
import { actions } from "~/components/user/table-actions";
import { columns } from "~/components/user/table-columns";
import { type UserWithGroup } from "~/server/api/routers/user";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Page() {
  const users: UserWithGroup[] = (await api.user.getAll({})) ?? [];
  const session = await getServerAuthSession();
  const role = session?.user.role ?? "USER";

  return (
    <div className="container mx-auto py-10">
      <DataTable role={role} columns={columns} data={users} actions={actions} />
    </div>
  );
}
