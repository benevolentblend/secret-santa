import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
          recipientGames: {
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
});
