import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/types/server";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
//This is trpc's routes(S2)
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return { success: true };
  }),
});
export type AppRouter = typeof appRouter;
