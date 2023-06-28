import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.REACT_APP_OPENAI_ORGANIZATION_KEY,
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);
