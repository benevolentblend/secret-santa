import UserTable from "~/app/users/table";
import { redirect } from "next/navigation";
import { getRole } from "~/server/auth";

export default async function Page() {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");

  if (!["Moderator", "Admin"].includes(role)) redirect("/");

  return <UserTable role={role} />;
}
