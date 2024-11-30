"use client";

import { type Game } from "@prisma/client";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";

import { getPromoteGameStatus } from "~/lib/utils";

interface PromoteButtonProps {
  game: Game;
  promoteAction: (gameId: string) => void;
}

const PromoteButton: React.FC<PromoteButtonProps> = ({
  game,
  promoteAction,
}) => {
  if (game.status === "Complete") {
    return;
  }

  const getMatches = api.game.getMatches.useQuery({ id: game.id });
  const unmatchedPatronsCount =
    getMatches.data?.filter(({ recipientId }) => recipientId === null).length ??
    1;

  const nextGameStatus = getPromoteGameStatus(game.status);

  return (
    <Button
      variant="outline"
      onClick={() => promoteAction(game.id)}
      disabled={game.status === "Sorting" && unmatchedPatronsCount > 0}
    >
      Promote to {nextGameStatus}
    </Button>
  );
};

export default PromoteButton;
