import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class GetModelAnswer {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsOptional()
  modelId?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;
}
