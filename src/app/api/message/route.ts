import { db } from "@/db";
import { pc } from "@/lib/Pinecone";
import { sendMessageValidators } from "@/lib/Validators/SendMessageValidators";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PineconeStore } from "@langchain/pinecone";
import { VoyageEmbeddings } from "langchain/embeddings/voyage";
import { NextRequest, NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export const POST = async (req: NextRequest, res: NextResponse) => {
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
  //vectorize message and query pinecone db for similar vectors

  const pineconeIndex = pc.Index("updf");
  const embeddings = new VoyageEmbeddings({
    apiKey: process.env.VOYAGE_AI_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id, //use for searching specfic index
  });

  const results = await vectorStore.similaritySearch(message, 4);
  const prevMessages = await db.message.findMany({
    where: {
      fileId,
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 6,
  });
  //idhar se change karna hai(from here we need to change)
  const contextFromResults = results
    .map((result) => result.pageContent)
    .join("\n");
  const groqPrevMessages = prevMessages.map((msg) => ({
    role: msg.isUserMessage ? "user" : "assistant",
    content: msg.text,
  }));

  const combinedContext = [
    ...groqPrevMessages,
    {
      role: "assistant",
      content: contextFromResults,
    },
    {
      role: "user",
      content: message, //user question
    },
  ];
  const groqClient = new Groq({ apiKey: process.env.GORQ_API_KEY });
  const answer = await groqClient.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "The assistant's response should be informed by the context from the user's previous messages, the current user question, and the most relevant content identified by the similarity search.",
      },
      ...combinedContext,
    ],
    model: "llama3-8b-8192",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let fullText = ""; // Initialize a variable to accumulate the text

      for await (const part of answer) {
        const text = part.choices[0].delta.content || "";
        fullText += text; // Accumulate the text
        controller.enqueue(encoder.encode(text));
      }

      // After the loop completes, store the accumulated text in the database
      await db.message.create({
        data: {
          text: fullText, // Store the accumulated text
          isUserMessage: false,
          userId: user.id,
          fileId,
        },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
};
