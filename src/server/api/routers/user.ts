import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

const ids = z.string().array();

export const userRouter = createTRPCRouter({
  assignToGroup: adminProcedure
    .input(z.object({ ids, groupId: z.string() }))
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
          message: "Group does not exist",
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

  updateRole: adminProcedure
    .input(z.object({ ids, role: z.nativeEnum(UserRole) }))
    .mutation(async ({ ctx, input }) => {
      const userCount = await ctx.db.user.count({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

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
          role: input.role,
        },
      });
    }),

  assignToNewGroup: adminProcedure
    .input(z.object({ ids, newGroupName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userCount = await ctx.db.user.count({
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (userCount !== input.ids.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unable to find users to update.",
        });
      }

      const newGroup = await ctx.db.group.create({
        data: {
          name: input.newGroupName,
        },
      });

      return ctx.db.user.updateMany({
        where: {
          id: { in: input.ids },
        },
        data: {
          groupId: newGroup.id,
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
