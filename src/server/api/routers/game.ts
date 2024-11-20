import { type GameStatus } from "@prisma/client";
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

  GetAvailableUsers: protectedProcedure
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
            none: {},
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
      return ctx.db.gameMatch.findMany({
        where: {
          gameId: input.id,
        },
        include: {
          recipient: true,
          patron: true,
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
