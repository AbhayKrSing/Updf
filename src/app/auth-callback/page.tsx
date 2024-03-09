import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
//We will sync user to database here
const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); //useful
  const origin = searchParams.get("origin");
  const { data, isLoading } = trpc.authCallback.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.success) {
        router.push(origin ? `/${origin}` : "dashboard");
      }
    },
  });
};

export default page;
