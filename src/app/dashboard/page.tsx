import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return <div>Hello this is dashboard with user {user?.email}</div>;
};

export default page;
