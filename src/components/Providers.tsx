import React, { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { httpBatchLink } from "@trpc/react-query";
const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000/api/trpc",
          // You can pass any HTTP headers you wish here
          async headers() {
            //Will look at it.(Todo)
            return {
              authorization: getAuthCookie(),
            };
          },
        }),
      ],
    })
  );
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
export default Providers;

function getAuthCookie(): string | string[] | undefined {
  throw new Error("Function not implemented.");
}
