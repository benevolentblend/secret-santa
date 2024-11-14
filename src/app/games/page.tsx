import { getRole } from "~/server/auth";

import Permission from "~/components/user/permission";
import CreateGameButton from "~/components/game/create-button";
import { GameList } from "./game-list";

export default async function Page() {
  const role = await getRole();

  return (
    <main className="container mx-auto max-w-screen-xl p-4">
      <div className="py-4">
        <Permission role={role} allowedRoles={["ADMIN"]}>
          <CreateGameButton />
        </Permission>
      </div>
      <GameList />
    </main>
  );
}
