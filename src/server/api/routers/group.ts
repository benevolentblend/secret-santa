import { z } from "zod";

import { createTRPCRouter, moderatorProcedure } from "~/server/api/trpc";

export const groupRouter = createTRPCRouter({
  getAll: moderatorProcedure
    .input(z.object({ take: z.number().int().default(10) }))
    .query(({ ctx, input }) => {
      return ctx.db.group.findMany({
        take: input.take,
        orderBy: { createdAt: "desc" },
      });
    }),
});
