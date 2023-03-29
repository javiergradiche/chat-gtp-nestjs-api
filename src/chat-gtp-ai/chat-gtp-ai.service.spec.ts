import { Test, TestingModule } from '@nestjs/testing';
import { ChatGtpAiService } from './chat-gtp-ai.service';

describe('ChatGtpAiService', () => {
  let service: ChatGtpAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGtpAiService],
    }).compile();

    service = module.get<ChatGtpAiService>(ChatGtpAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
