"use client";

import TimeAgo from "react-timeago";
import { type Game } from "@prisma/client";
import Link from "next/link";

import { api } from "~/trpc/react";
import Avatar, { PlaceHolderAvatar } from "~/components/user/avatar";
import GamePreview from "~/components/game/game-preview";
import { Skeleton } from "~/components/ui/skeleton";
interface GameList {
  games: Game[];
}

const cutoffLimit = 4;

const SkeletonGame = () => (
  <GamePreview>
    <div className="w-full items-center justify-between lg:flex">
      <Skeleton className="h-[28px] w-[200px]" />
      <Skeleton className="h-[28px] w-[120px]" />
    </div>
    <div className="flex w-full items-center justify-between pt-2">
      <Skeleton className="h-[40px] w-[40px] rounded-full" />
    </div>
  </GamePreview>
);

export function GameList() {
  const allGamesRequest = api.game.getAll.useQuery({});
  const { isLoading } = allGamesRequest;

  const games = allGamesRequest.data ?? [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonGame />
            <SkeletonGame />
            <SkeletonGame />
          </>
        ) : (
          games.map((game) => {
            const users = game.GameMatches.map((game) => game.patron);
            return (
              <div className="pb-4" key={game.id}>
                <Link href={`/games/${game.id}`}>
                  <GamePreview>
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
                  </GamePreview>
                </Link>
              </div>
            );
          })
        )}
      </div>
      {!isLoading && !games.length && (
        <div className="text-center">
          <p>Looks like you don&apos;t have any games yet.</p>
        </div>
      )}
    </>
  );
}
