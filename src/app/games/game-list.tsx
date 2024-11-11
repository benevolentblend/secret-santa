"use client";

import TimeAgo from "react-timeago";
import { type Game } from "@prisma/client";
import Link from "next/link";

import { api } from "~/trpc/react";
interface GameList {
  games: Game[];
}

export function GameList() {
  const allGamesRequest = api.game.getAll.useQuery({});
  const games = allGamesRequest.data ?? [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => {
          return (
            <div className="pb-4" key={game.id}>
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
