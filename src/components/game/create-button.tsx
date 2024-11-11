"use client";

import { api } from "~/trpc/react";

import { GameForm, type Values } from "~/components/game/create-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

const CreateGameButton: React.FC = () => {
  const [createGameDialogOpen, setCreateGameDialogOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const utils = api.useUtils();
  const createGame = api.game.create.useMutation({
    async onError() {
      toast.error("An error occured when creating the game");
    },
    async onSettled() {
      await utils.game.getAll.invalidate();
    },
  });

  const onSubmit = (values: Values) => {
    createGame.mutate(values);

    setCreateGameDialogOpen(false);
  };

  return (
    <Dialog open={createGameDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setCreateGameDialogOpen(true)}>
          Create Game
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Game</DialogTitle>
          <DialogDescription>Create a new Secret Santa Game.</DialogDescription>
        </DialogHeader>
        <GameForm
          onSubmit={onSubmit}
          initialName={`Christmas ${currentYear}`}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameButton;
