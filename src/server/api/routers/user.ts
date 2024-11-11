import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export type UserWithGroup = Prisma.UserGetPayload<{
  include: {
    group: {
      select: {
        name: true;
      };
    };
  };
}>;

export const userRouter = createTRPCRouter({
  updateGroups: adminProcedure
    .input(z.object({ ids: z.string().array(), groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const groupCount = await ctx.db.group.count({
        where: {
          id: input.groupId,
        },
      });

      const userCount = await ctx.db.user.count({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (groupCount < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group does not Exist",
        });
      }

      if (userCount !== input.ids.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to find users to update.",
        });
      }

      return ctx.db.user.updateMany({
        where: {
          id: { in: input.ids },
        },
        data: {
          groupId: input.groupId,
        },
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ take: z.number().int().default(10) }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findMany({
        take: input.take,
        include: {
          group: {
            select: {
              name: true,
            },
          },
        },
      });
    }),
});
