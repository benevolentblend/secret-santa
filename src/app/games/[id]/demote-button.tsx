import { type Game } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

import { revalidatePath } from "next/cache";
import { getDemoteGameStatus } from "~/lib/utils";

interface DemoteButtonProps {
  game: Game;
}

const PromoteButton: React.FC<DemoteButtonProps> = async ({ game }) => {
  if (game.status === "Setup") {
    return;
  }

  const promote = async () => {
    "use server";
    await api.game.demote({ id: game.id });
    revalidatePath(`/game/${game.id}`);
  };

  const nextGameStatus = getDemoteGameStatus(game.status);

  return (
    <Button variant="outline" onClick={promote}>
      Demote to {nextGameStatus}
    </Button>
  );
};

export default PromoteButton;
