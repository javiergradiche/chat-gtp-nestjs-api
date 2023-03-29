import { Module } from '@nestjs/common';
import { ChatGtpAiController } from './chat-gtp-ai.controller';
import { ChatGtpAiService } from './chat-gtp-ai.service';

@Module({
  controllers: [ChatGtpAiController],
  providers: [ChatGtpAiService]
})
export class ChatGtpAiModule {}
