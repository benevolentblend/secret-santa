import { Prisma, type GameStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getPromoteGameStatus, getDemoteGameStatus, db } from "~/server/db";
import type { Player, UserMap } from "../sort";
import bruteForceMatch from "../sort/brute-force";

const userWithGroup = {
  include: {
    group: {
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    },
  },
};

export const gameRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.game.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ take: z.number().int().default(10) }))
    .query(({ ctx, input }) => {
      const { role, id: userId } = ctx.session.user;

      const limitUsersGames =
        role === "User"
          ? {
              GameMatches: {
                some: {
                  patronId: userId,
                },
              },
            }
          : undefined;

      return ctx.db.game.findMany({
        take: input.take,
        orderBy: { createdAt: "desc" },
        include: {
          GameMatches: {
            include: {
              patron: true,
              recipient: true,
            },
          },
        },
        where: limitUsersGames,
      });
    }),

  getAvailableUsers: protectedProcedure
    .input(
      z.object({
        take: z.number().int().default(10),
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.user.findMany({
        take: input.take,
        where: {
          patronGames: {
            none: {
              gameId: input.id,
            },
          },
        },
      });
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.game.findFirst({
        where: {
          id: input.id,
        },
        include: {
          GameMatches: {
            select: {
              patronId: true,
              recipientId: true,
            },
          },
        },
      });
    }),

  getMatches: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.gameMatch.findMany({
        where: {
          gameId: input.id,
        },
        include: {
          recipient: userWithGroup,
          patron: userWithGroup,
        },
      });
    }),

  getMatch: protectedProcedure
    .input(z.object({ gameId: z.string(), patronId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.gameMatch.findFirst({
        where: {
          gameId: input.gameId,
          patronId: input.patronId,
        },
        include: {
          patron: true,
          recipient: {
            include: {
              profile: true,
            },
          },
        },
      });
    }),

  promote: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.game.findFirst({ where: { id: input.id } });

      if (!game) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to promote game.",
        });
      }

      if (game.status == "Complete") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot promote completed game.",
        });
      }

      const newStatus: GameStatus = getPromoteGameStatus(game.status);

      return ctx.db.game.update({
        where: {
          id: input.id,
        },
        data: {
          status: newStatus,
        },
      });
    }),

  demote: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.game.findFirst({ where: { id: input.id } });

      if (!game) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to demote game.",
        });
      }

      if (game.status == "Setup") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot demote setup game.",
        });
      }

      const newStatus: GameStatus = getDemoteGameStatus(game.status);

      return ctx.db.game.update({
        where: {
          id: input.id,
        },
        data: {
          status: newStatus,
        },
      });
    }),

  assignRecipients: adminProcedure
    .input(
      z.object({
        matches: z
          .object({
            recipientId: z.string().nullish(),
            patronId: z.string(),
          })
          .array(),
        gameId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const gameMatchKeys = input.matches.map(({ patronId }) => ({
        gameId: input.gameId,
        patronId,
      }));

      const game = await ctx.db.game.findFirst({
        where: {
          id: input.gameId,
        },
      });

      const filteredMatches = input.matches.map(
        ({ recipientId, patronId }) => ({ recipientId, patronId }),
      );

      if (!game) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Game does not exist.",
        });
      }

      if (game.status !== "Sorting") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Unable to assign secipients in a setup, active, or completed game.",
        });
      }

      const gameMatches = await ctx.db.gameMatch.findMany({
        where: {
          OR: gameMatchKeys,
        },
      });

      if (gameMatches.length !== input.matches.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Game matches do not exist",
        });
      }

      const gameMatchesIds = gameMatches.map((match) => match.id);
      const newGameMatches = filteredMatches.map((gameMatch) => ({
        ...gameMatch,
        gameId: input.gameId,
      }));

      try {
        await ctx.db.$transaction(
          [
            ctx.db.gameMatch.deleteMany({
              where: { id: { in: gameMatchesIds } },
            }),
            ctx.db.gameMatch.createMany({
              data: newGameMatches,
            }),
          ],
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );

        return gameMatches.length;
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "There was a problem assigning the recipients. ",
        });
      }
    }),

  sort: adminProcedure
    .input(
      z.object({
        rounds: z.number().int(),
        attempts: z.number().int(),
        excludeLastMatches: z.number().int().default(3),
        gameId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const gameMatches = await ctx.db.gameMatch.findMany({
        where: {
          gameId: input.gameId,
        },
        include: {
          patron: userWithGroup,
        },
      });

      const playerIds = gameMatches.map(({ patronId }) => patronId);

      const users = gameMatches.reduce((result: UserMap, item) => {
        result[item.patronId] = item.patron;
        return result;
      }, {});

      const previousMatches = await db.gameMatch.findMany({
        where: { patronId: { in: playerIds } },
        orderBy: {
          createdAt: "desc",
        },
      });

      const players: Player[] = gameMatches.map(
        ({ patronId: currentPartonId, patron }) => {
          // Remove groups and self
          const availablePlayers = playerIds.filter((playerId) => {
            if (!patron.group) return playerId !== currentPartonId;
            const groupIds = patron.group.users.map(({ id }) => id);

            return !groupIds.includes(playerId);
          });

          // Remove previous matches
          const userPreviousMatches = previousMatches
            .filter(({ patronId }) => patronId === currentPartonId)
            .slice(0, input.excludeLastMatches);

          console.log(`${patron.name} pervious matches`);

          userPreviousMatches.forEach(({ recipientId }) => {
            if (recipientId) console.log(`${users[recipientId]?.name}`);
          });

          return [
            currentPartonId,
            availablePlayers.filter(
              (player) =>
                !userPreviousMatches
                  .map(({ recipientId }) => recipientId)
                  .includes(player),
            ),
          ];
        },
      );

      const result = bruteForceMatch({
        players,
        attempts: input.attempts,
        rounds: input.rounds,
        users,
      });

      return result;
    }),
});
