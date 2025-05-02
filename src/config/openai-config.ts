const openAiConfig = {
  apiKey: process.env.OPENAI_API_KEY!,
  taskCreatorAssistantId: process.env.OPENAI_TASK_CREATOR_ASSISTANT_ID!,
  summarizerAssistantId: process.env.OPENAI_TASK_SUMMARIZER_ASSISTANT_ID!,
};
export default openAiConfig;
