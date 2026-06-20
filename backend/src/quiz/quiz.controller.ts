import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto, QuizResponseDto } from './quiz.dto';

@Controller('api/quizzes')
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Get()
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiOkResponse({ type: [QuizResponseDto] })
  getAll(@Query('search') search?: string) {
    return this.quizService.getAll(search);
  }

  @Get(':id')
  @ApiOkResponse({ type: QuizResponseDto })
  getById(@Param('id') id: string) {
    return this.quizService.getById(Number(id));
  }

  @Post()
  @ApiCreatedResponse({ type: QuizResponseDto })
  create(@Body() dto: CreateQuizDto) {
    return this.quizService.create(dto);
  }

  @Put(':id')
  @ApiOkResponse({ type: QuizResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateQuizDto) {
    return this.quizService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNoContentResponse()
  async delete(@Param('id') id: string) {
    await this.quizService.delete(Number(id));
  }
}
