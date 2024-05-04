import { db } from "@/db";
import { sendMessageValidators } from "@/lib/Validators/SendMessageValidators";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  //end point for asking question to pdf

  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.id) {
    return new Response("unauthorized", { status: 401 });
  }
  const { fileId, message } = sendMessageValidators.parse(body);
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });
  if (!file) {
    return new Response("Not found", { status: 404 });
  }
  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId: user.id,
      fileId,
    },
  });
  //we need to index uploaded pdf file for sementic query,In order to do so we will do all indexing using langchain just after uploading file in core.ts
};
