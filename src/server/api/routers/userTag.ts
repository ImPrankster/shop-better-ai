import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const UserTagRouter = createTRPCRouter({
  getAllTextTags: publicProcedure
    .output(z.object({ id: z.string().uuid(), name: z.string() }).array())
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.textTag.findMany({
        where: { published: true },
        select: {
          id: true,
          name: true,
        },
      });
      return data;
    }),

  getAllImageTags: publicProcedure
    .output(z.object({ id: z.string().uuid(), name: z.string() }).array())
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.imageTag.findMany({
        where: { published: true },
        select: {
          id: true,
          name: true,
        },
      });
      return data;
    }),

  getUserTextTag: privateProcedure
    .output(z.string().uuid().array())
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.userTextTagExpectation.findMany({
        where: {
          userId: ctx.userId,
        },
      });

      return data.map((tagRelationship) => tagRelationship.textTagId);
    }),

  setUserTextTag: privateProcedure
    .input(z.set(z.string().uuid()))
    .mutation(async ({ ctx, input }) => {
      const currentTags = await ctx.prisma.userTextTagExpectation.findMany({
        where: {
          userId: ctx.userId,
        },
      });

      const currentTagIds = currentTags.map(
        (tagRelationship) => tagRelationship.textTagId
      );

      const newTags = [...input].filter(
        (tagId) => !currentTagIds.includes(tagId)
      );

      const deleteTags = currentTagIds.filter(
        (tagId) => ![...input].includes(tagId)
      );

      await ctx.prisma.userTextTagExpectation.deleteMany({
        where: {
          userId: ctx.userId,
          textTagId: {
            in: deleteTags,
          },
        },
      });

      await ctx.prisma.userTextTagExpectation.createMany({
        data: newTags.map((tagId) => ({
          userId: ctx.userId,
          textTagId: tagId,
        })),
      });
    }),

  setUserImageTag: privateProcedure
    .input(z.set(z.string().uuid()))
    .mutation(async ({ ctx, input }) => {
      const currentTags = await ctx.prisma.userImageTagExpectation.findMany({
        where: {
          userId: ctx.userId,
        },
      });

      const currentTagIds = currentTags.map(
        (tagRelationship) => tagRelationship.imageTagId
      );

      const newTags = [...input].filter(
        (tagId) => !currentTagIds.includes(tagId)
      );

      const deleteTags = currentTagIds.filter(
        (tagId) => ![...input].includes(tagId)
      );

      await ctx.prisma.userImageTagExpectation.deleteMany({
        where: {
          userId: ctx.userId,
          imageTagId: {
            in: deleteTags,
          },
        },
      });

      await ctx.prisma.userImageTagExpectation.createMany({
        data: newTags.map((tagId) => ({
          userId: ctx.userId,
          imageTagId: tagId,
        })),
      });
    }),

  getUserImageTag: privateProcedure
    .output(z.string().uuid().array())
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.userImageTagExpectation.findMany({
        where: {
          userId: ctx.userId,
        },
      });

      return data.map((tagRelationship) => tagRelationship.imageTagId);
    }),
});
