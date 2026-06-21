import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '../generated/prisma/index.js';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TIME_LIMIT_MIN, TIME_LIMIT_MAX } from '@quizapp/shared';

export class QuestionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(6)
  @IsString({ each: true })
  answers: string[];

  @ApiPropertyOptional({ minimum: TIME_LIMIT_MIN, maximum: TIME_LIMIT_MAX })
  @IsOptional()
  @IsInt()
  @Min(TIME_LIMIT_MIN)
  @Max(TIME_LIMIT_MAX)
  timeLimit?: number;
}

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: Difficulty })
  @IsEnum(Difficulty)
  difficulty: Difficulty;

  @ApiProperty({ minimum: TIME_LIMIT_MIN, maximum: TIME_LIMIT_MAX })
  @IsInt()
  @Min(TIME_LIMIT_MIN)
  @Max(TIME_LIMIT_MAX)
  defaultTimeLimit: number;

  @ApiProperty({ type: [QuestionDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class UpdateQuizDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Difficulty })
  @IsOptional()
  @IsEnum(Difficulty)
  difficulty?: Difficulty;

  @ApiPropertyOptional({ minimum: TIME_LIMIT_MIN, maximum: TIME_LIMIT_MAX })
  @IsOptional()
  @IsInt()
  @Min(TIME_LIMIT_MIN)
  @Max(TIME_LIMIT_MAX)
  defaultTimeLimit?: number;

  @ApiPropertyOptional({ type: [QuestionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[];
}

// ─── Response DTO ────────────────────────────────────────────────────────────
// Описывают реальную форму данных, которые бэк отдаёт обратно (включают id,
// сгенерированный Prisma'ой, и временные метки). Используются только для
// Swagger-документации через @ApiResponse в контроллере — Nest не выполняет
// по ним валидацию/сериализацию автоматически (для этого нужен ClassSerializerInterceptor,
// если он понадобится позже).

export class QuestionResponseDto extends QuestionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quizId: number;
}

export class QuizResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: Difficulty })
  difficulty: Difficulty;

  @ApiProperty()
  defaultTimeLimit: number;

  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[];

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
