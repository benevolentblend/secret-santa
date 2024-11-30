import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

import { auth } from "~/server/auth";
import Profile from "~/components/user/profile";

export default async function Page() {
  const session = await auth();

  if (!session?.user) redirect("/api/auth/signin");

  const user = await api.user.get({ id: session.user.id });

  if (!user) {
    return <div>Profile not found.</div>;
  }

  return (
    <>
      <div className="py-4">
        <Profile user={user} />
      </div>
    </>
  );
}
