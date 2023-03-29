import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class AnalyzeEmailResponseDto {
  @IsString()
  @IsNotEmpty()
  emailResponse: string;

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
