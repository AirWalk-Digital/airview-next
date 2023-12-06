import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import fs from "fs";
import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { LLMChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { StreamingTextResponse } from "ai";

// export const runtime = "edge";

export async function POST(req) {
  const formatMessage = (message) => {
    return `${message.role}: ${message.content}`;
  };

  const TEMPLATE = `You are an IT expert. All responses must be extremely verbose and technical in nature.
      Answer the question based only on the following context:
      {context}
      
      Current conversation:
      {chat_history}
      
      User: {input}
      AI:`;

const TEXT = `
State of the Union Address Example

My fellow Americans,

As we gather here tonight, the state of our union is strong. Our economy is growing, our citizens are prospering, and our nation is safe and secure. We have faced challenges in the past year, but our resolve has never been stronger.

In the past year, we have made significant progress in key areas. Our administration has worked tirelessly to improve the lives of every American. We have made great strides in healthcare, ensuring that more citizens have access to affordable care. Education has been at the forefront of our agenda, with increased funding for schools and support for teachers.

We have also made significant advancements in technology and innovation. Our efforts in renewable energy are paying off, leading us towards a more sustainable and environmentally friendly future. The job market continues to grow, offering opportunities in new and emerging industries.

However, there is still work to be done. We must continue to strive for equality and justice for all our citizens, regardless of their background. Infrastructure improvements are needed to keep up with the growing demands of our nation. And we must remain vigilant in protecting our country from external threats.

Looking ahead, our goals are clear. We aim to strengthen our economy further, enhance our national security, and ensure that the American dream is attainable for all. With unity and determination, there is no limit to what we can achieve.

Together, let us continue to build a brighter future for our great nation.

Thank you, God bless you, and God bless America.

`;

  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  console.log('formattedPreviousMessages: ', formattedPreviousMessages)
  const currentMessageContent = messages[messages.length - 1].content;
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const model = new ChatOpenAI({temperature: 0.8, modelName: 'gpt-3.5-turbo', openAIApiKey: OPENAI_API_KEY});
//   const text = fs.readFileSync("./state.txt", "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments(TEXT);
  
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings());
  const retriever = vectorStore.asRetriever();

  const serializeChatHistory = (chatHistory) => {
    if (Array.isArray(chatHistory)) {
      return chatHistory.join("\n");
    }
    return chatHistory;
  };

  const memory = new BufferMemory({
    memoryKey: "chatHistory",
  });

  const questionPrompt = PromptTemplate.fromTemplate(
    `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
CHAT HISTORY: {chatHistory}
----------------
CONTEXT: {context}
----------------
QUESTION: {question}
----------------
Helpful Answer:`
  );

  const questionGeneratorTemplate =
    PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
----------------
CHAT HISTORY: {chatHistory}
----------------
FOLLOWUP QUESTION: {question}
----------------
Standalone question:`);

  const handleProcessQuery = async (input) => {
    const chain = new LLMChain({
      llm: model,
      prompt: questionPrompt,
      outputParser: new StringOutputParser(),
      verbose: true,
      
    });


    const queryOut = await chain.stream({
        ...input,
        chatHistory: serializeChatHistory(input.chatHistory ?? ""),
      })

    console.log('queryOut: ', queryOut)

    const { text } = await chain.call({
      ...input,
      chatHistory: input.chatHistory ,
    });

    await memory.saveContext(
      {
        user: input.question,
      },
      {
        bot: text,
      }
    );

    return text;
  };

  const answerQuestionChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory
    },
    {
      question: (previousStepResult) => previousStepResult.question,
      chatHistory: (previousStepResult) =>
        serializeChatHistory(previousStepResult.chatHistory ?? ""),
      context: async (previousStepResult) => {
        const relevantDocs = await retriever.getRelevantDocuments(
          previousStepResult.question
        );
        const serialized = formatDocumentsAsString(relevantDocs);
        return serialized;
      },
    },
    handleProcessQuery,
  ]);

  const generateQuestionChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory,
    },
    questionGeneratorTemplate,
    model,
    {
      question: (previousStepResult) => previousStepResult.text,
    },
    answerQuestionChain,
  ]);

  const branch = RunnableBranch.from([
    [
        (input) => input.chatHistory,
      answerQuestionChain,
    ],
    [
        (input) => !input.chatHistory,
      generateQuestionChain,
    ],
    answerQuestionChain,
  ]);

  const fullChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chatHistory: (input) => input.chatHistory
    },
    branch,
  ]);

  const stream = await fullChain.stream({
    question: currentMessageContent,
    chatHistory: formattedPreviousMessages
  });

  return new StreamingTextResponse(stream);
  // } catch (e) {
  //   return NextResponse.json({ error: e.message }, { status: 500 });
  // }
}
