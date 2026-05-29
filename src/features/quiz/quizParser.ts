import type { ImportedQuestion, Question } from './types'

export interface ParseResult {
  success: true
  questions: Question[]
}

export interface ParseError {
  success: false
  error: string
}

function generateId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Валидирует один вопрос из JSON.
 * Возвращает строку с ошибкой или null если всё ок.
 */
function validateQuestion(item: unknown, index: number): string | null {
  if (typeof item !== 'object' || item === null) {
    return `Вопрос #${index + 1}: должен быть объектом`
  }

  const q = item as Record<string, unknown>

  if (typeof q.text !== 'string' || q.text.trim() === '') {
    return `Вопрос #${index + 1}: поле "text" обязательно и должно быть строкой`
  }

  if (!Array.isArray(q.answers)) {
    return `Вопрос #${index + 1}: поле "answers" должно быть массивом`
  }

  if (q.answers.length < 2) {
    return `Вопрос #${index + 1}: нужно минимум 2 варианта ответа`
  }

  if (q.answers.length > 6) {
    return `Вопрос #${index + 1}: максимум 6 вариантов ответа`
  }

  for (let i = 0; i < q.answers.length; i++) {
    if (typeof q.answers[i] !== 'string' || (q.answers[i] as string).trim() === '') {
      return `Вопрос #${index + 1}: ответ #${i + 1} должен быть непустой строкой`
    }
  }

  if (q.timeLimit !== undefined) {
    if (typeof q.timeLimit !== 'number' || q.timeLimit < 5 || q.timeLimit > 120) {
      return `Вопрос #${index + 1}: "timeLimit" должен быть числом от 5 до 120`
    }
  }

  return null
}

/**
 * Парсит JSON-строку от пользователя в массив Question[].
 * Принимает как массив вопросов, так и объект { questions: [...] }.
 *
 * Ожидаемый формат:
 * [
 *   {
 *     "text": "Вопрос?",
 *     "answers": ["ПРАВИЛЬНЫЙ", "НЕВЕРНЫЙ 1", "НЕВЕРНЫЙ 2"],
 *     "timeLimit": 15  // опционально
 *   }
 * ]
 *
 * answers[0] — всегда правильный ответ.
 */
export async function parseQuestionsJSON(
  raw: string
): Promise<ParseResult | ParseError> {
  // async чтобы в будущем можно было добавить fetch/валидацию через API
  await Promise.resolve()

  if (raw.trim() === '') {
    return { success: false, error: 'Поле не может быть пустым' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { success: false, error: 'Невалидный JSON. Проверьте синтаксис.' }
  }

  // Поддерживаем оба формата: массив или { questions: [...] }
  let items: unknown[]
  if (Array.isArray(parsed)) {
    items = parsed
  } else if (
    typeof parsed === 'object' &&
    parsed !== null &&
    Array.isArray((parsed as Record<string, unknown>).questions)
  ) {
    items = (parsed as { questions: unknown[] }).questions
  } else {
    return {
      success: false,
      error: 'Ожидается массив вопросов или объект с полем "questions"',
    }
  }

  if (items.length === 0) {
    return { success: false, error: 'Список вопросов пуст' }
  }

  // Валидируем каждый вопрос
  for (let i = 0; i < items.length; i++) {
    const err = validateQuestion(items[i], i)
    if (err) return { success: false, error: err }
  }

  // Приводим к нашему типу Question
  const questions: Question[] = (items as ImportedQuestion[]).map(item => ({
    id: generateId(),
    text: item.text.trim(),
    answers: item.answers.map(a => a.trim()) as [string, ...string[]],
    ...(item.timeLimit !== undefined ? { timeLimit: item.timeLimit } : {}),
  }))

  return { success: true, questions }
}

/**
 * Пример JSON для отображения в placeholder textarea
 */
export const EXAMPLE_QUESTIONS_JSON = JSON.stringify(
  [
    {
      text: 'В каком городе находится знаменитое казино Белладжио?',
      answers: ['ЛАС-ВЕГАС', 'МОНАКО', 'МАКАО', 'ЛОНДОН'],
      timeLimit: 15,
    },
    {
      text: 'Какая карточная игра чаще всего встречается в казино?',
      answers: ['ПОКЕР', 'БРИДЖ', 'УНО', 'ПРЕФЕРАНС'],
    },
  ],
  null,
  2
)
