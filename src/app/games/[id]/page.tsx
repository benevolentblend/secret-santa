import { redirect } from "next/navigation";
import { z } from "zod";
import { getRole } from "~/server/auth";
import { api } from "~/trpc/server";
import MatchTable, { type GameMatchWithUsers } from "./match-table";
import AddUsersButton from "~/components/game/add-users";
import Permission from "~/components/user/permission";
import RemoveUsersButton from "~/components/game/add-remove";
import { type ColumnDef } from "@tanstack/react-table";
import PromoteButton from "./promote-button";
import DemoteButton from "./demote-button";

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

  const columns: ColumnDef<GameMatchWithUsers>[] = [
    {
      accessorKey: "recipient.name",
      header: "Recipient",
    },
  ];

  return (
    <>
      <h1 className="text-2xl">{game.name}</h1>
      <h3 className="text-xl">{game.status}</h3>
      <Permission role={role} allowedRoles={["Admin"]}>
        <div className="flex gap-2">
          {game.status === "Setup" && <AddUsersButton id={game.id} />}
          {game.status === "Setup" && <RemoveUsersButton id={game.id} />}
          {game.status !== "Complete" && <PromoteButton game={game} />}
          {game.status !== "Setup" && <DemoteButton game={game} />}
        </div>
      </Permission>

      <MatchTable id={game.id} role={role} columns={columns} />
    </>
  );
};

export default Page;
