import { OpenAI } from "openai";
import config from "../config/index";

// create a singleton pattern for open Ai client
let instance = null;

export function getOpenAiInstance() {
  if (!instance) {
    instance = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }
  return instance;
}

export async function createTaskWithAssistant(userPrompt) {
  const openai = getOpenAiInstance();

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userPrompt,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: config.openai.taskCreatorAssistantId,
    });

    return { threads: thread.id, runId: run.id };
  } catch (error) {
    console.log("Error creating task with OpenAI:", error);
    throw error;
  }
}

export async function getAssistantResponse(threadId, runId) {
  const openai = getOpenAiInstance();

  try {
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);

    while (runStatus.status !== "completed" && runStatus.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    }

    if (runStatus.status === "failed") {
      throw new Error("Assistant run failed: " + runStatus.last_error?.message);
    }

    const messages = await openai.beta.threads.messages.list(threadId);

    return messages.data
      .filter((message) => message.role === "assistant")
      .map((message) => message.content[0]?.text?.value || "")
      .join("\n");
  } catch (error) {
    console.log("Error getting response from OpenAI:", error);
    throw error;
  }
}

// export default instance for convenience
const openai = getOpenAiInstance();
export default openai;
