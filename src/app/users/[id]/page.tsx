import { redirect } from "next/navigation";
import { z } from "zod";
import { getRole } from "~/server/auth";
import { api } from "~/trpc/server";

const UrlSchema = z.object({ id: z.coerce.string() });

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  const safeParams = UrlSchema.safeParse(await params);

  if (safeParams.error) {
    return <div>Bad Url</div>;
  }

  const user = await api.user.get({ id: safeParams.data.id });
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl">{user.name}</h1>
      {!!user.group && <h3 className="text-xl">{user.group.name}</h3>}
    </div>
  );
};

export default Page;
