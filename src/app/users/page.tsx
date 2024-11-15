import UserTable from "~/app/users/table";
import { redirect } from "next/navigation";
import { getRole } from "~/server/auth";

export default async function Page() {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");

  return (
    <div className="container mx-auto py-10">
      <UserTable role={role} />
    </div>
  );
}
