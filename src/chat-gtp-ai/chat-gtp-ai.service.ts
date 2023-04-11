import { Injectable } from "@nestjs/common";
import {
  Configuration,
  OpenAIApi,
  CreateCompletionRequest,
  CreateCompletionResponse,
  CreateCompletionResponseChoicesInner,
  CreateChatCompletionResponse,
  CreateChatCompletionRequest,
} from "openai";
import {
  CreateSequenceDto,
  AnalyzeEmailResponseDto,
  AnalyzeProfileDto,
  QueryAiModelDto,
} from "./dto";

const DEFAULT_MODEL_ID = "gpt-3.5-turbo";
const DEFAULT_TEMPERATURE = 0.5;
const DEFAULT_MAX_TOKENS = 2000;
const PROMPT_FOR_SEPARATORS =
  ". Use separators #subject-start, #subject-end, #body-start, #body-end. For variables to replace use {{snake_case}}";

@Injectable()
export class ChatGtpAiService {
  private readonly openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORG_ID,
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("CONFIGURATION: ", configuration);
    this.openai = new OpenAIApi(configuration);
  }

  secureModelId(modelId: string) {
    if (modelId.includes(":")) {
      return modelId.replace(":", "-");
    }
    return modelId;
  }

  async listModels() {
    const models = await this.openai.listModels();
    return models.data;
  }

  async getModelAnswer(
    input: QueryAiModelDto
  ): Promise<
    CreateCompletionResponse | CreateCompletionResponseChoicesInner[]
  > {
    const { question, modelId, temperature, maxTokens } = input;
    try {
      const params: CreateCompletionRequest = {
        prompt: question,
        model: modelId ? this.secureModelId(modelId) : "text-davinci-003",
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
      };
      console.log(input);
      const response = await this.openai.createCompletion(params);
      const { data } = response;

      if (data.choices) return data.choices;
      return response.data;
    } catch (error) {
      throw Error("Error in getModelAnswer " + error);
    }
  }

  async getChatGPTModelAnswer(
    input: QueryAiModelDto
  ): Promise<
    CreateChatCompletionResponse | CreateCompletionResponseChoicesInner[]
  > {
    const { question, modelId, temperature, maxTokens } = input;
    try {
      const params: CreateChatCompletionRequest = {
        model: modelId ? this.secureModelId(modelId) : DEFAULT_MODEL_ID,
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      };
      console.log(input);
      const response = await this.openai.createChatCompletion(params);
      const { data } = response;

      console.log("RESPNSE: ", response);
      if (data.choices) return data.choices;
      return response.data;
    } catch (error) {
      throw Error("Error in getModelAnswer " + error);
    }
  }

  async createSequence(input: CreateSequenceDto): Promise<any> {
    const {
      projectName,
      jobDescription,
      modelId,
      temperature,
      maxTokens,
      template,
    } = input;

    let question = template || process.env.TEMPLATE_SEQUENCE_CREATION;
    question = question.replace(/{{projectName}}/g, projectName);
    question = question.replace(/{{jobDescription}}/g, jobDescription);
    question += PROMPT_FOR_SEPARATORS;

    try {
      const params: CreateChatCompletionRequest = {
        model: modelId ? this.secureModelId(modelId) : DEFAULT_MODEL_ID,
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      };
      const response = await this.openai.createChatCompletion(params);
      const { data } = response;

      if (data.choices) {
        const content = data.choices[0].message.content;
        const emails = this.splitResponseToEmails(content);
        const variables = this.extractVariables(content);
        return { emails, variables };
      }
    } catch (error) {
      throw Error("Error in create Sequence " + error);
    }
  }

  async analyzeProfile(input: AnalyzeProfileDto): Promise<any> {
    const {
      profile,
      jobDescription,
      modelId,
      temperature,
      maxTokens,
      template,
    } = input;

    let question = template || process.env.TEMPLATE_ANALYZE_PROFILE;
    question = question.replace(/{{profile}}/g, profile);
    question = question.replace(/{{jobDescription}}/g, jobDescription);

    try {
      const params: CreateChatCompletionRequest = {
        model: modelId ? this.secureModelId(modelId) : DEFAULT_MODEL_ID,
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      };
      const response = await this.openai.createChatCompletion(params);
      console.log("RESPONSE: ", response);
      const { data } = response;

      if (data.choices) {
        const analysis = data.choices[0].message.content;
        const rating = this.extractRating(analysis);
        return { analysis, rating };
      }
    } catch (error) {
      throw Error("Error in analysis: " + error);
    }
  }

  async analyzeEmailResponse(input: AnalyzeEmailResponseDto): Promise<any> {
    const { emailResponse, modelId, temperature, maxTokens, template } = input;

    let question = template || process.env.TEMPLATE_REVIEW_EMAIL_RESPONSE;
    question = question.replace(/{{emailResponse}}/g, emailResponse);

    console.log("QUESTION: ", question);
    try {
      const params: CreateChatCompletionRequest = {
        model: modelId ? this.secureModelId(modelId) : DEFAULT_MODEL_ID,
        temperature: temperature || DEFAULT_TEMPERATURE,
        max_tokens: maxTokens || DEFAULT_MAX_TOKENS,
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
      };
      const response = await this.openai.createChatCompletion(params);
      const { data } = response;

      if (data.choices) {
        const analysis = data.choices[0].message.content;
        const interest = this.extractInterest(analysis);
        return { analysis, interest };
      }
    } catch (error) {
      throw Error("Error in analysis: " + error);
    }
  }
  splitResponseToEmails = (response: string) => {
    const emailArray = [];
    const subjectMatches = response.match(
      /#subject-start(.|\n)*?#subject-end/g
    );
    const bodyMatches = response.match(/#body-start(.|\n)*?#body-end/g);
    for (let i = 0; i < bodyMatches.length; i++) {
      const subject = subjectMatches[i]
        .replace("#subject-start\n", "")
        .replace("\n#subject-end", "");
      const body = bodyMatches[i]
        .replace("#body-start\n", "")
        .replace("#body-end", "");
      const variables = this.extractVariables(body);
      emailArray.push({ subject, body, variables });
    }
    return emailArray;
  };

  extractVariables = (response: string) => {
    const variables = response.match(/{{(.)*?}}/g);
    const variablesArray = [];
    for (let i = 0, l = variables.length; i < l; i++) {
      const variableName = variables[i].replace("{{", "").replace("}}", "");
      if (variablesArray.indexOf(variableName) === -1 && variableName !== "")
        variablesArray.push(variableName);
    }
    return variablesArray;
  };

  extractRating = (response: string) => {
    const rating = response.match(/\d+ out of \d+/);
    return rating[0];
  };

  extractInterest = (response: string) => {
    const category = response.split("Category: ")[1];
    return category;
  };
}
