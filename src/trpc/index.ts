
import { router } from "./trpc";
import { userRouter } from "./routers/userRouter";
export const appRouter = router({
 user: userRouter,
});
export type AppRouter = typeof appRouter;
