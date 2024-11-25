import { auth, getRole } from "~/server/auth";

import { redirect } from "next/navigation";
import Profile from "~/components/user/profile";

export default async function Page() {
  const session = await auth();

  if (!session?.user) redirect("/api/auth/signin");

  return (
    <>
      <div className="py-4">
        <Profile />
      </div>
    </>
  );
}
