import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGtpAiModule } from './chat-gtp-ai/chat-gtp-ai.module';

@Module({
  imports: [ConfigModule.forRoot(), ChatGtpAiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
