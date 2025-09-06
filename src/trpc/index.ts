// import { procedure, router } from "./trpc";
import { router } from "./trpc";
// import { currentUser } from "@clerk/nextjs/server";
// import { TRPCError } from "@trpc/server";
// import { prismaDB } from "../lib/prismaConnect";

export const appRouter = router({
  // ACCOUNT CREATION AND LOGING APIS -------------------------
  // 1. CREATE ACCOUNT
  // authSignUp: procedure.mutation(async () => {
  //   const auth = await currentUser();
  //   console.log(auth);
  //   if (!auth) {
  //     throw new TRPCError({ code: "UNAUTHORIZED" });
  //   }
  //   const isUserExists = await prismaDB.user.findUnique({
  //     where: {
  //       externalId: auth.id,
  //     },
  //   });
  //   if (!isUserExists) {
  //     await prismaDB.user.create({
  //       data: {
  //         externalId: auth.id,
  //         name: auth.fullName!,
  //         email: auth.emailAddresses[0]?.emailAddress || "",
  //         imageUrl: auth.imageUrl,
  //       },
  //     });
  //   }
  //   return { isSynced: true };
  // }),
  // // // 2. LOGGING ACCOUNT
  // authSignIn: procedure.query(async () => {
  //   const auth = await currentUser();
  //   if (!auth) {
  //     throw new TRPCError({ code: "UNAUTHORIZED" });
  //   }
  //   const userExists = await prismaDB.user.findFirst({
  //     where: {
  //       externalId: auth.id,
  //       email: auth.emailAddresses[0]?.emailAddress || "",
  //     },
  //   });
  //   if (userExists) {
  //     return { isSynced: true };
  //   } else {
  //     return { isSynced: false };
  //   }
  // }),
});
export type AppRouter = typeof appRouter;
