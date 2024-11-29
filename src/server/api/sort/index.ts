import type { User } from "@prisma/client";

export type Player = [string, string[]];
export type UserMap = Record<string, User>;
export type MatchedPlayer = [string, string];

export const getRandomValues = (max: number) => Math.floor(Math.random() * max);

export const displayPlayers = (players: Player[], users: UserMap) =>
  players.map((player) => [
    `${users[player[0]]?.name}`,
    player[1].map((match) => `${users[match]?.name}`),
  ]);

export const displayMatches = (matches: MatchedPlayer[], users: UserMap) => {
  return matches.map(([patron, recipient]) => [
    `${users[patron]?.name}`,
    `${users[recipient]?.name}`,
  ]);
};
