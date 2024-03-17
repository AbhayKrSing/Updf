import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
interface PageProps {
  params: {
    fileId: string;
  };
}
const page = async ({ params }: PageProps) => {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }
  //make database call
  const file = db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  }

  return <div>Your file id is:{fileId}</div>;
};

export default page;
