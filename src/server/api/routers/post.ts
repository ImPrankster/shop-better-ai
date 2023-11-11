import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const PostRouter = createTRPCRouter({
  getPosts: privateProcedure
    .input(z.object({ cursor: z.string().uuid().nullish(), limit: z.number() }))
    .output(
      z.object({
        posts: z
          .object({
            productId: z.string().uuid(),
            tagline: z.string(),
            image: z.string().url(),
            textId: z.string(),
          })
          .array(),
        nextCursor: z.string().uuid().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const prouct = await ctx.prisma.product.findMany({
        take: input.limit + 10,
        skip: 1,
        orderBy: {
          id: "desc",
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: {
          published: true,
        },
        select: {
          id: true,
          generatedText: {
            where: {
              tag: {
                every: {
                  published: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              title: true,
              tag: true,
              id: true,
            },
          },
          generatedImage: {
            where: {
              tag: {
                every: {
                  published: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              url: true,
              tag: true,
            },
          },
          productExtensionImage: {
            select: {
              type: true,
              url: true,
            },
          },
        },
      });

      const userTextTags = (
        await ctx.prisma.userTextTagExpectation.findMany({
          where: {
            userId: ctx.userId,
            textTag: {
              published: true,
            },
          },
        })
      ).map((tag) => tag.textTagId);
      const userImageTags = (
        await ctx.prisma.userImageTagExpectation.findMany({
          where: {
            userId: ctx.userId,
            imageTag: {
              published: true,
            },
          },
        })
      ).map((tag) => tag.imageTagId);

      const output = prouct.flatMap((p) => {
        if (!p.generatedText || !p.generatedText[0]) {
          return [];
        }

        let shownProductText = p.generatedText[0];
        let shownProductImage = p.productExtensionImage[0]?.url;

        let bestIntersectionText = 0;
        for (const text of p.generatedText) {
          const textTags = text.tag.map((tag) => tag.id);
          const intersection = textTags.filter((x) => userTextTags.includes(x));
          if (intersection.length > bestIntersectionText) {
            bestIntersectionText = intersection.length;
            shownProductText = text;
          }
        }

        let bestIntersectionImage = 0;
        for (const img of p.generatedImage) {
          const imgTags = img.tag.map((tag) => tag.id);
          const intersection = imgTags.filter((x) => userImageTags.includes(x));
          if (intersection.length > bestIntersectionImage) {
            bestIntersectionImage = intersection.length;
            shownProductImage = img.url;
          }
        }

        if (!shownProductImage) {
          return [];
        }

        return [
          {
            productId: p.id,
            tagline: shownProductText.title,
            image: shownProductImage,
            textId: shownProductText.id,
          },
        ];
      });

      return {
        posts: output,
        nextCursor: output[output.length - 1]?.productId,
      };
    }),

  getDetailedPost: privateProcedure
    .input(z.string().uuid())
    .output(
      z.object({
        title: z.string(),
        body: z.string(),
        image: z.string().url().array(),
        originalUrl: z.string().url(),
        shopUrl: z.string().url(),
        brandLogo: z.string().url().nullish(),
        brandName: z.string(),
        tags: z.string().array(),
      })
    )
    .query(async ({ ctx, input }) => {
      const text = await ctx.prisma.generatedText.findUnique({
        where: {
          id: input,
        },
        select: {
          title: true,
          body: true,
          tag: true,
          product: {
            select: {
              originalUrl: true,
              shopUrl: true,
              productBrand: true,
              generatedImage: {
                orderBy: {
                  createdAt: "desc",
                },
                select: {
                  id: true,
                  tag: true,
                  url: true,
                },
              },
              productExtensionImage: {
                select: {
                  url: true,
                },
              },
            },
          },
        },
      });

      if (!text) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This page does not exist",
        });
      }

      const userExpectedTags = (
        await ctx.prisma.userImageTagExpectation.findMany({
          where: {
            userId: ctx.userId,
          },
          select: {
            imageTag: true,
          },
        })
      ).map((tag) => tag.imageTag.name);

      const generatedImages = text.product.generatedImage
        .map((image) => {
          let tagsIncluded = 0;
          image.tag.forEach((tag) => {
            if (userExpectedTags.includes(tag.name)) {
              tagsIncluded += 1;
            }
          });

          return { id: image.id, url: image.url, tagsIncluded: tagsIncluded };
        })
        .filter((image) => image.tagsIncluded > 0)
        .sort((a, b) => {
          return b.tagsIncluded - a.tagsIncluded;
        })
        .map((image) => {
          return image.url;
        });

      const originImages = text.product.productExtensionImage.map(
        (image) => image.url
      );

      const tags = text.tag.map((tag) => tag.name);

      // const concatedImages = [...generatedImages, ...originImages];
      if (generatedImages[0]) {
        originImages.unshift(generatedImages[0]);
      }

      return {
        title: text.title,
        body: text.body,
        image: originImages,
        originalUrl: text.product.originalUrl,
        shopUrl: text.product.shopUrl,
        brandLogo: text.product.productBrand.logoUrl,
        brandName: text.product.productBrand.name,
        tags: tags,
      };
    }),
});
