import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { RedisVectorStore } from "@langchain/community/vectorstores/redis";
import { createClient } from "redis";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { EmbeddingsFilter } from "langchain/retrievers/document_compressors/embeddings_filter";

// WARNING: PLEASE DO NOT USE Langsmith when using production data
// as this has not been checked and approved.
// Code for using Langsmith
/*import { Client } from "langsmith";
import { ConsoleCallbackHandler, LangChainTracer } from "langchain/callbacks";*/

export async function POST(req) {
  try {
    const formatMessage = (message) => {
      return `${message.role}: ${message.content}`;
    };

    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    //console.log('formattedPreviousMessages: ', formattedPreviousMessages)
    const currentMessageContent = messages[messages.length - 1].content;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const MODEL_TEMPERATURE = parseInt(process.env.MODEL_TEMPERATURE);
    const REDIS_HOST = process.env.REDIS_HOST;
    //const jsonDelimiter = process.env.REACT_APP_CHAT_MESSAGE_DELIMITER;
    const jsonDelimiter = '###%%^JSON-DELIMITER^%%###'; // to be updated to extract from env
    const SIMILARITY_THRESHOLD = process.env.SIMILARITY_THRESHOLD;
    
    // WARNING: PLEASE DO NOT USE Langsmith when using production data
    // as this has not been checked and approved.
    // Code for using Langsmith
    /*const LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY;
    const LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT;

    const client = new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: LANGCHAIN_API_KEY
    });

    const tracer = new LangChainTracer({
      projectName: LANGCHAIN_PROJECT,
      client
    });*/
    
    const model = new ChatOpenAI({
      temperature: MODEL_TEMPERATURE,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: OPENAI_API_KEY
    });

    const redisClient = createClient({
      url: process.env.REDIS_URL ?? `redis://${REDIS_HOST}:6379`,
    });
    await redisClient.connect();
    console.log("Successfully connect to Redis");

    const baseCompressor = new EmbeddingsFilter({
      embeddings: new OpenAIEmbeddings(),
      similarityThreshold: SIMILARITY_THRESHOLD,
    });

    const vectorStore = new RedisVectorStore(new OpenAIEmbeddings(), {
      redisClient: redisClient,
      indexName: process.env.INDEX_NAME,
    });

    const retriever = new ContextualCompressionRetriever({
      baseCompressor,
      baseRetriever: vectorStore.asRetriever(),
    });

    const serializeChatHistory = (chatHistory) => {
      if (Array.isArray(chatHistory)) {
        return chatHistory.join("\n");
      }
      return chatHistory;
    };

    const questionPrompt = PromptTemplate.fromTemplate(
      `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know,\
  don't try to make up an answer. Check if CONTEXT: is empty. If so, just say that "I'm sorry, no related information found", don't try to provide an answer.
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  CONTEXT: {context}
  ----------------
  QUESTION: {question}
  ----------------
  Helpful Answer:`
    );

    const questionGeneratorTemplate = PromptTemplate.fromTemplate(
      `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  FOLLOWUP QUESTION: {question}
  ----------------
  Standalone question:`
    );

    let relevantDocs = [];
    const extractDocSource = async (currentQuestion) => {
      // code to extract sources from retrieverResult
      relevantDocs = await retriever.getRelevantDocuments(currentQuestion);
      return relevantDocs;
    };

    const answerQuestionChain = RunnableSequence.from([
      {
        question: (input) => input.question,
      },
      {
        question: (previousStepResult) => previousStepResult.question,
        chatHistory: async () => {
          const memoryResult = formattedPreviousMessages.join('\n');
          return memoryResult;
        },
        context: RunnableSequence.from([
          (previousStepResult) => previousStepResult.question,
          extractDocSource,
          formatDocumentsAsString
        ])
      },
      questionPrompt,
      model,
      new StringOutputParser(),
    ]);

    const generateQuestionChain = RunnableSequence.from([
      {
        question: (input) => input.question,
      },
      {
        question: (previousStepResult) => previousStepResult.question,
        chatHistory: async () => {
          const memoryResult = formattedPreviousMessages.join('\n');
          return memoryResult;
        },
      },
      questionGeneratorTemplate,
      model,
      new StringOutputParser()
    ]);

    const branch = RunnableBranch.from([
      [
        async () => {
          const isChatHistoryPresent =
            !!formattedPreviousMessages && formattedPreviousMessages.length;
            
          return isChatHistoryPresent;
        },
        // Take the result of the above model call, and pass it through to the
        // next RunnableSequence chain which will answer the question
        generateQuestionChain.pipe({
          question: (previousStepResult) => previousStepResult,
        }).pipe(answerQuestionChain),
      ],
      answerQuestionChain,
    ]);

    const fullChain = RunnableSequence.from([
      {
        question: (input) => input.question,
      },
      branch,
    ]);

    // WARNING: PLEASE DO NOT USE Langsmith when using production data
    // as this has not been checked and approved.
    // Code for using Langsmith
    /*const stream = await fullChain.stream(
      {question: currentMessageContent},
      { callbacks: [tracer]}
    );*/

    const stream = await fullChain.stream({ question: currentMessageContent });
    
    const messageId = `bot-${Date.now()}`;
    // Add properties to each document
    const updatedDocs = relevantDocs.map((Document, index) => ({
      ...Document,
      messageId: messageId,
      docId: `${messageId}-${index}`,
      role: 'bot',
      type: 'RelevantDocs'
    }));

    // Send the streaming response
    const response = new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // Loop through the stream and push chunks to the client
            for await (const chunk of stream) {
              // Wrap each chunk in a JSON object before sending it
              const jsonChunk = JSON.stringify({
                type: 'MessageStream',
                content: chunk,
                messageId: messageId,
                role: 'bot'
              });              
              controller.enqueue(jsonChunk + jsonDelimiter);
            }
            // Send related content
            for (const doc of updatedDocs) {
              const jsonDoc = JSON.stringify(doc);
              controller.enqueue(jsonDoc + jsonDelimiter);
            }
            
            // Signal the end of the stream
            controller.close();

          } catch (error) {
            // Handle any errors that occurred during streaming
            console.error("Error during streaming:", error);
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
      }
    );

    return response;


  } catch (e) {
    // Handle exceptions
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
