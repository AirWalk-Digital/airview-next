import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { BufferMemory } from "langchain/memory";
import { RunnableBranch, RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { LLMChain } from "langchain/chains";
import { formatDocumentsAsString } from "langchain/util/document";
import { StreamingTextResponse } from "ai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { createClient } from "redis";

export async function POST(req) {
  const formatMessage = (message) => {
    return `${message.role}: ${message.content}`;
  };

  const body = await req.json();
  const messages = body.messages ?? [];
  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  console.log('formattedPreviousMessages: ', formattedPreviousMessages)
  const currentMessageContent = messages[messages.length - 1].content;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const REDIS_HOST = process.env.REDIS_HOST;

  const model = new ChatOpenAI({temperature: 0.8, modelName: 'gpt-3.5-turbo', openAIApiKey: OPENAI_API_KEY});

  const redisClient = createClient({
    url: process.env.REDIS_URL ?? `redis://${REDIS_HOST}:6379`,
  });
  await redisClient.connect();
  console.log("Successfully connect to Redis");
  
  const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
    redisClient: redisClient,
    indexName: process.env.INDEX_NAME,
  });
  //console.log("vectorStore: ", vectorStore); //for debugging

  const retriever = vectorStore.asRetriever();
  //console.log("Retriever: ", retriever); //for debugging

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
