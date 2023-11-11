import { PostRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";

import { UserTagRouter } from "./routers/userTag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: PostRouter,
  userTag: UserTagRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
