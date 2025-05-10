import config from "@/config";
import openAiConfig from "@/config/openai-config";
import OpenAI from "openai";

console.log("OpenAI config:", openAiConfig);
console.log("API Key defined:", !!openAiConfig.apiKey);

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export { openai };
