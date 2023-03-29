import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatGtpAiService } from './chat-gtp-ai.service';
import { GetModelAnswer } from './dto/create-ai-mode';

@Controller('chat-gtp-ai')
export class ChatGtpAiController {
  constructor(private readonly chatGtpAiService: ChatGtpAiService) {}

  @Post('/message')
  @UsePipes(ValidationPipe)
  getModelAnswer(@Body() data: GetModelAnswer) {
    return this.chatGtpAiService.getModelAnswer(data);
  }

  @Get('/models')
  getModels() {
    return this.chatGtpAiService.listModels();
  }
}
