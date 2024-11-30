import { redirect } from "next/navigation";

import UserTable from "~/app/users/table";

import { getRole } from "~/server/auth";

import { hasModeratorAccess } from "~/lib/utils";

export default async function Page() {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  if (!hasModeratorAccess(role)) redirect("/");

  return <UserTable role={role} />;
}
