// import { currentUser } from "@clerk/nextjs/server";
// import { initTRPC, TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
// import { PrismaClient } from "../lib/generated/prisma/client";

const t = initTRPC.create();
// const middleware = t.middleware;
// const prisma = new PrismaClient();

// Middlware to check whether the user is logged in or not
// const isUserAuthenticated = middleware(async (opts) => {
//   const auth = await currentUser();
//   if (!auth) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   const userData = await prisma.user.findFirst({
//     where: {
//       externalId: auth.id,
//     },
//   });
//   if (!userData) {
//     throw new TRPCError({ code: "NOT_FOUND" });
//   }
//   return opts.next({
//     ctx: {
//       userId: userData.id,
//       userData,
//     },
//   });
// });

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
// export const privateProcedure = t.procedure.use(isUserAuthenticated);
