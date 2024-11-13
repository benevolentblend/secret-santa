import UserTable from "~/app/users/table";

import { getSessionRole } from "~/server/auth";

export default async function Page() {
  const role = await getSessionRole();

  return (
    <div className="container mx-auto py-10">
      <UserTable role={role} />
    </div>
  );
}
