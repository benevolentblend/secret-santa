import { redirect } from "next/navigation";
import { z } from "zod";
import { getRole } from "~/server/auth";
import { api } from "~/trpc/server";
import MatchTable from "./match-table";
import AddUsersButton from "../../../components/game/add-users";
import Permission from "~/components/user/permission";

const UrlSchema = z.object({ id: z.coerce.number().int() });

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");
  const safeParams = UrlSchema.safeParse(await params);

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
      <Permission role={role} allowedRoles={["ADMIN"]}>
        <AddUsersButton id={game.id} />
      </Permission>
      <MatchTable id={game.id} role={role} />
    </>
  );
};

export default Page;
