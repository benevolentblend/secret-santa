import { type Game } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { getPromoteGameStatus } from "~/server/db";
import { api } from "~/trpc/server";

import { revalidatePath } from "next/cache";

interface PromoteButtonProps {
  game: Game;
}

const PromoteButton: React.FC<PromoteButtonProps> = async ({ game }) => {
  if (game.status === "Complete") {
    return;
  }

  const promote = async () => {
    "use server";
    await api.game.promote({ id: game.id });
    revalidatePath(`/game/${game.id}`);
  };

  const nextGameStatus = getPromoteGameStatus(game.status);

  return (
    <Button variant="outline" onClick={promote}>
      Promote to {nextGameStatus}
    </Button>
  );
};

export default PromoteButton;
