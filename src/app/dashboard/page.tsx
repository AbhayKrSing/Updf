import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    redirect("/auth-callback?origin=dashboard");
  }
  //check User sync in database ot not(If yes Stay here otherwise send them to authCallback for syncing user to database)
  const dbuser = db.user.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!dbuser) {
    redirect("/auth-callback?origin=dashboard");
  }
  return <Dashboard />;
};

export default page;
