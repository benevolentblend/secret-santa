import { redirect } from "next/navigation";

import { getRole } from "~/server/auth";
import CreateGameButton from "~/components/game/create-button";
import Permission from "~/components/user/permission";

import { GameList } from "./game-list";

export default async function Page() {
  const role = await getRole();

  if (!role) redirect("/api/auth/signin");

  return (
    <>
      <div className="py-4">
        <Permission role={role} allowedRoles={["Admin", "Moderator"]}>
          <CreateGameButton />
        </Permission>
      </div>
      <GameList />
    </>
  );
}
