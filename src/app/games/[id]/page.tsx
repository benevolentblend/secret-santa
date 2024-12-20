import { redirect } from "next/navigation";

import { api } from "~/trpc/server";
import { z } from "zod";

import { auth } from "~/server/auth";
import RemoveUsersButton from "~/components/game/add-remove";
import AddUsersButton from "~/components/game/add-users";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import AutoMatch from "./auto-match";
import DemoteButton from "./demote-button";
import Match from "./match";
import MatchTable from "./match-table";
import promote from "./promote";
import PromoteButton from "./promote-button";
import SelectRecipients from "./select-recipients";
import HiddenRecipient from "./table-columns/hidden-recipient";
import PatronColumn from "./table-columns/patron";
import RecipientColumn from "./table-columns/recipient";

const UrlSchema = z.object({ id: z.string() });

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  const columns = [PatronColumn];

  if (!session) redirect("/api/auth/signin");
  const role = session.user.role;
  const safeParams = UrlSchema.safeParse(await params);

  if (safeParams.error) {
    return <div>Bad Url</div>;
  }

  const game = await api.game.get({ id: safeParams.data.id });

  if (!game) {
    return <div>Game not found</div>;
  }

  const canManageGame =
    role === "Admin" ||
    (role === "Moderator" && game.managerId === session.user.id);

  if (game.status === "Active" && canManageGame) {
    columns.push(HiddenRecipient);
  }
  if (game.status === "Complete") {
    columns.push(RecipientColumn);
  }

  return (
    <>
      <h1 className="pb-2 text-2xl">{game.name}</h1>
      <h3 className="pb-4 text-xl">
        <Badge>{game.status}</Badge>
      </h3>
      {canManageGame && (
        <div className="flex gap-2 pb-2">
          {game.status === "Setup" && <AddUsersButton id={game.id} />}
          {game.status === "Setup" && <RemoveUsersButton id={game.id} />}
          {game.status !== "Complete" && (
            <PromoteButton game={game} promoteAction={promote} />
          )}
          {game.status !== "Setup" && <DemoteButton game={game} />}
        </div>
      )}
      <div className="gap-2 pb-4 lg:flex">
        <div className="flex-1 pb-2">
          <MatchTable id={game.id} role={role} columns={columns} />
        </div>
        {["Active", "Complete"].includes(game.status) && (
          <div className="flex-1">
            <Match gameId={game.id} patronId={session.user.id} />
          </div>
        )}
      </div>

      {game.status === "Sorting" && canManageGame && (
        <Card>
          <CardHeader>
            <CardTitle>Match</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="auto">
              <TabsList>
                <TabsTrigger value="auto">Auto Sort</TabsTrigger>
                <TabsTrigger value="manual">Manual Sort</TabsTrigger>
              </TabsList>
              <TabsContent value="auto">
                <AutoMatch gameId={game.id} />
              </TabsContent>
              <TabsContent value="manual">
                <SelectRecipients gameId={game.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Page;
