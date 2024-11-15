import { redirect } from "next/navigation";
import { z } from "zod";
import { getRole } from "~/server/auth";
import { api } from "~/trpc/server";

const UrlSchema = z.object({ id: z.coerce.number().int() });

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  const safeParams = await UrlSchema.safeParseAsync(params);

  if (safeParams.error) {
    return <div>Bad Url</div>;
  }

  const game = await api.game.get({ id: safeParams.data.id });

  if (!game) {
    return <div>Game not found</div>;
  }

  return (
    <>
      <h1 className="text-2xl">{game.name}</h1>
    </>
  );
};

export default Page;
