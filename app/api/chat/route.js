import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import {StreamingTextResponse } from "ai";
export const runtime = "edge";

const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

/**
 * This handler initializes and calls a simple chain with a prompt,
 * chat model, and output parser. See the docs for more information:
 *
 * https://js.langchain.com/docs/guides/expression_language/cookbook#prompttemplate--llm--outputparser
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    
    const model = new ChatOpenAI({
      temperature: 0.8,
    });

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
