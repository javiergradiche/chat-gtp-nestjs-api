import { Test, TestingModule } from '@nestjs/testing';
import { ChatGtpAiController } from './chat-gtp-ai.controller';

describe('ChatGtpAiController', () => {
  let controller: ChatGtpAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatGtpAiController],
    }).compile();

    controller = module.get<ChatGtpAiController>(ChatGtpAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
