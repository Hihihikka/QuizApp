import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuizDto, UpdateQuizDto } from './quiz.dto';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  getAll(search?: string) {
    return this.prisma.quiz.findMany({
      where: search
        ? { title: { contains: search, mode: 'insensitive' } }
        : undefined,
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!quiz) throw new NotFoundException(`Quiz ${id} not found`);
    return quiz;
  }

  create(dto: CreateQuizDto) {
    const { questions, ...meta } = dto;
    return this.prisma.quiz.create({
      data: {
        ...meta,
        questions: { create: questions },
      },
      include: { questions: true },
    });
  }

  async update(id: number, dto: UpdateQuizDto) {
    await this.getById(id);
    const { questions, ...meta } = dto;
    return this.prisma.quiz.update({
      where: { id },
      data: {
        ...meta,
        ...(questions && {
          questions: {
            deleteMany: {},
            create: questions.map(({ text, answers, timeLimit }) => ({
              text,
              answers,
              ...(timeLimit !== undefined ? { timeLimit } : {}),
            })),
          },
        }),
      },
      include: { questions: true },
    });
  }

  async delete(id: number) {
    await this.getById(id);
    return this.prisma.quiz.delete({ where: { id } });
  }
}
