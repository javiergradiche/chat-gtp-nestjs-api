import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatGtpAiService } from './chat-gtp-ai.service';
import {
  CreateSequenceDto,
  AnalyzeEmailResponseDto,
  AnalyzeProfileDto,
  QueryAiModelDto,
} from './dto';

@Controller('chat-gtp-ai')
export class ChatGtpAiController {
  constructor(private readonly chatGtpAiService: ChatGtpAiService) {}

  @Post('/message')
  @UsePipes(ValidationPipe)
  getModelAnswer(@Body() data: QueryAiModelDto) {
    return this.chatGtpAiService.getModelAnswer(data);
  }

  @Post('/gpt-message')
  @UsePipes(ValidationPipe)
  getChatGPTModelAnswer(@Body() data: QueryAiModelDto) {
    return this.chatGtpAiService.getChatGPTModelAnswer(data);
  }

  @Get('/models')
  getModels() {
    return this.chatGtpAiService.listModels();
  }

  @Post('/create-sequence')
  createSequence(@Body() data: CreateSequenceDto) {
    return this.chatGtpAiService.createSequence(data);
  }

  @Post('/analyze-profile')
  analyzeProfile(@Body() data: AnalyzeProfileDto) {
    return this.chatGtpAiService.analyzeProfile(data);
  }

  @Post('/analyze-response')
  analyzeEmailResponse(@Body() data: AnalyzeEmailResponseDto) {
    return this.chatGtpAiService.analyzeEmailResponse(data);
  }
}
