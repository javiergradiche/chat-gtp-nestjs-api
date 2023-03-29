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

  it('split segments to emails and variables', () => {
    const response = `#subject-start
Welcome to Coworkear!
#subject-end
#body-start
Dear {{firstName}},

We are thrilled to have you apply for the Coworkear position. Your experience with Ruby on Rails and React caught our attention and we are excited to learn more about your skills and qualifications.

Thank you for your interest in joining our team. We will be in touch soon with more information about the next steps in the hiring process.

Best regards,
The Coworkear Hiring Team
#body-end

#subject-start
Thank you for applying!
#subject-end
#body-start
Dear {{firstName}},

We wanted to thank you for taking the time to apply for the Coworkear position. We appreciate your interest in our company and your experience with Ruby on Rails and React.

We are currently reviewing applications and will be in touch with you soon regarding the next steps in the hiring process. If you have any questions in the meantime, please feel free to reach out to us.

Best regards,
The Coworkear Hiring Team
#body-end

#subject-start
Update on your application
#subject-end
#body-start
Dear {{firstName}},

We hope this email finds you well. We wanted to give you a quick update on your application for the Coworkear position. We are still in the process of reviewing applications and will be in touch with you soon regarding next steps.

Thank you again for your interest in our company and your experience with Ruby on Rails and React. We look forward to speaking with you soon.

Best regards,
The Coworkear Hiring Team
#body-end

#subject-start
Final update on your application
#subject-end
#body-start
Dear {{firstName}},

We wanted to provide you with a final update on your application for the Coworkear position. After careful consideration, we have decided to move forward with other candidates who more closely match our current needs.

We want to thank you for your interest in our company and for taking the time to apply for this position. We encourage you to keep an eye on our website for future job opportunities.

Best regards,
The Coworkear Hiring Team
#body-end`;
    expect(service).toBeDefined();

    const emails = service.splitResponseToEmails(response);
    expect(emails.length).toBe(4);
    expect(emails[0].subject).toBe('Welcome to Coworkear!');
    expect(emails[1].subject).toBe('Thank you for applying!');
    expect(emails[2].subject).toBe('Update on your application');
    expect(emails[3].body).toContain(
      'We wanted to provide you with a final update',
    );

    const variables = service.extractVariables(response);
    expect(variables.length).toBe(1);
    expect(emails[0].variables[0]).toBe('firstName');
    expect(variables[0]).toBe('firstName');
  });

  it('extract rating', () => {
    const response = `I would rate this profile as an 8 out of 10 for the job description. The profile has extensive experience in software
development and has worked with startups to build robust and scalable platforms. They also have experience working with
Cardano Blockchain, which aligns with the job description's focus on building an open financial system. However, the
profile does not mention specific experience with service-oriented architecture or writing high-quality, well-tested
code, which are skills highlighted in the job description.

Overall, this profile could be a good candidate for the job based on their experience and interests, but the job
requirements may need to be further discussed to determine if they have the necessary skills for the position.`;
    const rating = service.extractRating(response);
    expect(rating).toBe('8 out of 10');
  });
});
