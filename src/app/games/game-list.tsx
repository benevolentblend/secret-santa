"use client";

import TimeAgo from "react-timeago";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { GameForm, type Values } from "./form";
import { api } from "~/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Game } from "@prisma/client";
import Link from "next/link";

interface GameList {
  data: Game[];
}

export function GameList({ data }: GameList) {
  const currentYear = new Date().getFullYear();

  const utils = api.useUtils();
  const createGame = api.game.create.useMutation({
    async onError() {
      toast.error("An error occured when creating the game");
    },
    async onSettled() {
      console.log("Settling");
      await utils.game.getAll.invalidate();
    },
  });

  const onSubmit = (values: Values) => {
    createGame.mutate(values);

    setCreateGameDialogOpen(false);
  };

  const [createGameDialogOpen, setCreateGameDialogOpen] = useState(false);

  return (
    <>
      <div className="py-4">
        <Dialog open={createGameDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={() => setCreateGameDialogOpen(true)}
            >
              Create Game
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Game</DialogTitle>
              <DialogDescription>
                Create a new Secret Santa Game.
              </DialogDescription>
            </DialogHeader>
            <GameForm
              onSubmit={onSubmit}
              initialName={`Christmas ${currentYear}`}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((game) => {
          return (
            <div className="pb-4 " key={game.id}>
              <Link href={`/games/${game.id}`}>
                <div className="rounded-md border p-4 transition-all hover:bg-accent">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-xl font-semibold">{game.name}</div>
                    <div className="text-foreground">
                      <TimeAgo date={game.createdAt} />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-2">
                    <div className="text-neutral-600">No players.</div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
