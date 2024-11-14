import UserTable from "~/app/users/table";

import { getRole } from "~/server/auth";

export default async function Page() {
  const role = await getRole();

  return (
    <div className="container mx-auto py-10">
      <UserTable role={role} />
    </div>
  );
}
