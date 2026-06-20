import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { QuizController } from './quiz/quiz.controller';
import { QuizService } from './quiz/quiz.service';

@Module({
  controllers: [QuizController],
  providers: [PrismaService, QuizService],
})
export class AppModule {}
