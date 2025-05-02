import dbConfig from "./db-config";
import openAiConfig from "./openai-config";
import resendConfig from "./resend-config";
import twilioConfig from "./twilio-config";

const config = {
  db: dbConfig,
  resend: resendConfig,
  openai: openAiConfig,
  twilio: twilioConfig,
};
export default config;

// phone number, api key,
