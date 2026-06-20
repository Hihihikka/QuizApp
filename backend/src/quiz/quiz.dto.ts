import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Difficulty } from '@prisma/client';

export class QuestionDto {
  @ApiProperty()
  text: string;

  @ApiProperty({ type: [String] })
  answers: string[];

  @ApiPropertyOptional()
  timeLimit?: number;
}

export class CreateQuizDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: Difficulty })
  difficulty: Difficulty;

  @ApiProperty()
  defaultTimeLimit: number;

  @ApiProperty({ type: [QuestionDto] })
  questions: QuestionDto[];
}

export class UpdateQuizDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional({ enum: Difficulty })
  difficulty?: Difficulty;

  @ApiPropertyOptional()
  defaultTimeLimit?: number;

  @ApiPropertyOptional({ type: [QuestionDto] })
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
