import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); //useful
  const origin = searchParams.get("origin");
  console.log(origin);
  return <div></div>;
};

export default page;
