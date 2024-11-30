import UserTable from "~/app/users/table";
import { redirect } from "next/navigation";
import { getRole } from "~/server/auth";
import { hasModeratorAccess } from "~/server/db";

export default async function Page() {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  if (!hasModeratorAccess(role)) redirect("/");

  return <UserTable role={role} />;
}
