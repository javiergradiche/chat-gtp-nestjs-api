import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class AnalyzeProfileDto {
  @IsString()
  @IsNotEmpty()
  profile: string;

  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsOptional()
  modelId?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsString()
  @IsOptional()
  template: string;
}
