import { getRole } from "~/server/auth";

import Permission from "~/components/user/permission";
import CreateGameButton from "~/components/game/create-button";
import { GameList } from "./game-list";
import { redirect } from "next/navigation";

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
