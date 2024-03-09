//This is clientside trpc for server component(C1)
import { appRouter } from "@/trpc";
import { httpBatchLink } from "@trpc/client";

export const serverClient = appRouter.createCaller({
  links: [httpBatchLink({ url: "https://localhost:3000/api/trpc" })],
});
