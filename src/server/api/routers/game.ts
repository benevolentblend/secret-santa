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
      console.log(input);
      return ctx.db.game.findMany({
        take: input.take,
        orderBy: { createdAt: "desc" },
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
});
