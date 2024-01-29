import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import { RedisVectorStore } from "@langchain/community/vectorstores/redis";
import { createClient } from "redis";

//WARNING: PLEASE DO NOT USE Langsmith when using production data
// as this has not been checked and approved.
//import { Client } from "langsmith";
//import { LangChainTracer } from "langchain/callbacks";

export async function POST(req) {
  try {
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

    /* 
    // WARNING: PLEASE DO NOT USE Langsmith when using production data
    // as this has not been checked and approved.
    // For Langsmith
    const LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY;
    const LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT;

    const client = new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: LANGCHAIN_API_KEY
    });

    const tracer = new LangChainTracer({
      projectName: LANGCHAIN_PROJECT,
      client
    });
    */

    const model = new ChatOpenAI({
      temperature: 0.8,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: OPENAI_API_KEY
    });

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

    const questionGeneratorTemplate = PromptTemplate.fromTemplate(
      `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
  ----------------
  CHAT HISTORY: {chatHistory}
  ----------------
  FOLLOWUP QUESTION: {question}
  ----------------
  Standalone question:`
    );

    //const retrieverResult = await retriever.getRelevantDocuments(
    //  currentMessageContent
    //);
    //console.log("Retriever Result: ", retrieverResult); // for debugging

    /*
    const deduplicateMetadata = metadataArray => {
      // Create a Map to store unique metadata based on source and title
      const uniqueMetadataMap = new Map();
    
      // Iterate through metadataArray to deduplicate
      metadataArray.forEach(metadata => {
        const key = `${metadata.source}-${metadata.title}`;
    
        // Check if the key is not present in the Map, add it
        if (!uniqueMetadataMap.has(key)) {
          uniqueMetadataMap.set(key, metadata);
        }
      });
    
      // Convert the Map values back to an array
      const deduplicatedMetadataArray = Array.from(uniqueMetadataMap.values());
    
      return deduplicatedMetadataArray;
    };
    */
    
    //Function extract metadata and return retriever result as string to be implemented
    let relevantDocs = [];
    const extractDocSource = async (currentQuestion) => {
      // code to extract sources from retrieverResult
      relevantDocs = await retriever.getRelevantDocuments(currentQuestion);
      console.log('relevantDocs ', relevantDocs);
      return relevantDocs;
    };

    const answerQuestionChain = RunnableSequence.from([
      {
        question: (input) => input.question,
      },
      {
        question: (previousStepResult) => previousStepResult.question,
        chatHistory: (previousStepResult) =>
          serializeChatHistory(previousStepResult.chatHistory ?? ""),
        //context: retrieverResult, // Pass the retriever result to the context
        context: RunnableSequence.from([
          (previousStepResult) => previousStepResult.question,
          //retriever,
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
        chatHistory: (previousStepResult) =>
          serializeChatHistory(previousStepResult.chatHistory ?? ""),
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
    //const stream = await fullChain.stream(
    //  {question: currentMessageContent},
    //{ callbacks: [tracer]}
    //);

    const stream = await fullChain.stream({ question: currentMessageContent });
    const messageID = `bot-${Date.now()}`;
    // Add an id property to each document
    const updatedDocs = relevantDocs.map((Document) => ({
      ...Document,
      id: messageID,
      role: 'bot',
      type: 'RelevantDocs'
    }));
    //console.log('updatedDocs: ', updatedDocs);
    
    // Send the streaming response manually
    const response = new Response(
      new ReadableStream({
        async start(controller) {
          try {
            // Loop through the stream and push chunks to the client
            for await (const chunk of stream) {
              // Wrap each chunk in a JSON object before sending it
              const jsonChunk = JSON.stringify(
                {
                  type: 'MessageStream',
                  content: chunk,
                  id: messageID,
                  role: 'bot'
                }
              );
              controller.enqueue(jsonChunk);
            }

            //console.log('deduplicatedMetadata.length = ',deduplicatedMetadata.length);
            // After streaming all messages, send deduplicatedMetadata to the client
            for await (const doc of updatedDocs) {
              /*const jsonRelevantDocs = JSON.stringify(
                {
                  type: 'RelevantDocs',
                  title: Document.metadata.title,
                  source: Document.metadata.source,
                  id: messageID,
                  role: 'bot'
                }
              );*/
              console.log('Updated doc: ',doc);
              //controller.enqueue(jsonRelevantDocs);
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
