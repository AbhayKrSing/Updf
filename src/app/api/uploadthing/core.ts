import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pc } from "@/lib/Pinecone";
import { PineconeStore } from "@langchain/pinecone";
const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      // Here we will use vector database(pinecone) to store all vector of indexed pdf file(after, indexing using langchain)
      try {
        const res = await fetch(file.url);
        const blob = await res.blob();
        //now langchain will index blob
        const loader = new PDFLoader(blob);
        const docs = await loader.load(); //array of doc(by default 1 page=1doc)
        const pagesAmt = docs.length; //no of pages

        const pineconeIndex = pc.Index("updf"); //refer to vector db
        const embeddings = new OpenAIEmbeddings({
          apiKey: process.env.OPENAI_API_KEY,
        });
        await PineconeStore.fromDocuments(docs, embeddings, {
          //hover to see what do what
          pineconeIndex,
          namespace: createdFile.id,
        });
        await db.file.update({
          where: {
            id: createdFile.id,
            userId: metadata.userId,
          },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error) {
        console.log(error);
        await db.file.update({
          where: {
            id: createdFile.id,
            userId: metadata.userId,
          },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
