import ChatWrapper from "@/components/Chat/ChatWrapper";
import PdfRenderer from "@/components/PdfRenderer";
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
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  }

  return (
    <div className=" md:flex justify-center h-[calc(100vh-3.5rem)]">
      {/*  */}
      {/* left side PdfRenderer*/}
      <div className="flex-1 px-4 py-6 ">
        <PdfRenderer url={file.url} />
      </div>
      {/* Right side ChatWrapper*/}
      <div className="flex-[0.75] border-t md:border-t-0 md:border-l border-gray-200">
        <ChatWrapper fileId={file.id} />
      </div>
    </div>
  );
};

export default page;
