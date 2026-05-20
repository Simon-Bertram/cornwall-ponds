import type { RouterClient } from "@orpc/server";

import { protectedProcedure } from "../index";

export const appRouter = {
  me: protectedProcedure.handler(({ context }) => context.session.user),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session.user,
    };
  }),
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
