import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    redirect("/auth-callback?origin=dashboard");
  }
  return <div>Hello this is dashboard with user {user?.email}</div>;
};

export default page;
