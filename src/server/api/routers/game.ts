import { Prisma, type GameStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { getPromoteGameStatus, getDemoteGameStatus } from "~/server/db";

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
      });
    }),

  getAvailableUsers: protectedProcedure
    .input(
      z.object({
        take: z.number().int().default(10),
        id: z.number().int(),
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
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
      return ctx.db.game.findFirst({
        where: {
          id: input.id,
        },
      });
    }),

  getMatches: protectedProcedure
    .input(z.object({ id: z.number().int() }))
    .query(({ ctx, input }) => {
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

  promote: adminProcedure
    .input(z.object({ id: z.number().int() }))
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

  assignRecipients: adminProcedure
    .input(
      z.object({
        matches: z
          .object({
            recipientId: z.string().nullish(),
            patronId: z.string(),
          })
          .array(),
        gameId: z.number().int(),
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

  demote: adminProcedure
    .input(z.object({ id: z.number().int() }))
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
});
