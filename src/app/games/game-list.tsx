"use client";

import TimeAgo from "react-timeago";
import { type Game } from "@prisma/client";
import Link from "next/link";

import { api } from "~/trpc/react";
import Avatar, { PlaceHolderAvatar } from "~/components/user/avatar";
interface GameList {
  games: Game[];
}

const cutoffLimit = 4;

export function GameList() {
  const allGamesRequest = api.game.getAll.useQuery({});
  const games = allGamesRequest.data ?? [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => {
          const users = game.GameMatches.map((game) => game.patron);
          return (
            <div className="pb-4" key={game.id}>
              <Link href={`/games/${game.id}`}>
                <div className="h-[140px] rounded-md border p-4 transition-all hover:bg-accent lg:h-[115px]">
                  <div className="w-full items-center justify-between lg:flex">
                    <div className="text-xl font-semibold">{game.name}</div>
                    <div className="text-foreground">
                      <TimeAgo date={game.createdAt} />
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-2">
                    {!users.length && (
                      <div className="pt-2 text-neutral-600">No players.</div>
                    )}
                    <div className="flex">
                      {users.slice(0, cutoffLimit).map((user) => (
                        <div key={user.id} className="mr-[-10px]">
                          <Avatar user={user} className="shadow-lg" />
                        </div>
                      ))}
                      {users.length > cutoffLimit && (
                        <PlaceHolderAvatar
                          text={`${users.length - cutoffLimit} +`}
                          className="shadow-lg"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
        {/* {!games.length && } */}
      </div>
    </>
  );
}
