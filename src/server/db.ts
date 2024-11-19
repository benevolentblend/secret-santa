import { type GameStatus, PrismaClient } from "@prisma/client";

import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

type PromoteStatus = Exclude<GameStatus, "Complete">;
type DemoteStatus = Exclude<GameStatus, "Setup">;

export const getPromoteGameStatus = (state: PromoteStatus): GameStatus => {
  if (state === "Setup") {
    return "Sorting";
  }

  if (state === "Sorting") {
    return "Active";
  }

  return "Complete";
};

export const getDemoteGameStatus = (state: DemoteStatus): GameStatus => {
  if (state === "Complete") {
    return "Active";
  }

  if (state === "Active") {
    return "Sorting";
  }

  return "Setup";
};
