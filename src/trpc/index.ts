import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
//This is trpc's routes(S2)
export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.email || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    //Here we will sync user to database

    //checking user already exists or not
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      //sync user to db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId, user } = ctx;

    return await db.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        //Can do this on frontend also
        createdAt: "asc",
      },
    });
  }),
  deleteFiles: privateProcedure //post route
    .input(
      z.object({
        id: z.string(), //runtime type safe
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, user } = ctx;
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          id: input.id,
          userId,
        },
      });
      return file;
    }),
});
export type AppRouter = typeof appRouter;
