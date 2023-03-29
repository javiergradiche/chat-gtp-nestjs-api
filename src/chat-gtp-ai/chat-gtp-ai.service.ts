import { Injectable } from '@nestjs/common';
import {
  Configuration,
  OpenAIApi,
  CreateCompletionRequest,
  CreateCompletionResponse,
  Model,
  CreateCompletionResponseChoicesInner,
} from 'openai';
import { GetModelAnswer } from './dto/create-ai-mode';

const DEFAULT_MODEL_ID = 'text-davinci-003';
const DEFAULT_TEMPERATURE = 0.5;

@Injectable()
export class ChatGtpAiService {
  private readonly openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  secureModelId(modelId: string) {
    if (modelId.includes(':')) {
      return modelId.replace(':', '-');
    }
    return modelId;
  }

  async listModels() {
    const models = await this.openai.listModels();
    return models.data;
  }

  async getModelAnswer(
    input: GetModelAnswer,
  ): Promise<
    CreateCompletionResponse | CreateCompletionResponseChoicesInner[]
  > {
    const { question, modelId, temperature } = input;
    try {
      const params: CreateCompletionRequest = {
        prompt: question,
        model: modelId ? this.secureModelId(modelId) : DEFAULT_MODEL_ID,
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: 100,
      };
      const response = await this.openai.createCompletion(params);
      const { data } = response;

      if (data.choices) return data.choices;
      return response.data;
    } catch (error) {
      throw Error('Error in getModelAnswer ' + error);
    }
  }
}
