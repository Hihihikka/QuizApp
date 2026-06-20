import type { ImportedQuestion, DraftQuestion } from './types'

export interface ParseResult {
  success: true
  questions: DraftQuestion[]
}

export interface ParseError {
  success: false
  error: string
}

/**
 * Validates a single question from JSON.
 */
function validateQuestion(item: unknown, index: number): string | null {
  if (typeof item !== 'object' || item === null) {
    return `Question #${index + 1}: must be an object`
  }

  const q = item as Record<string, unknown>

  if (typeof q.text !== 'string' || q.text.trim() === '') {
    return `Question #${index + 1}: the "text" field is required and must be a string`
  }

  if (!Array.isArray(q.answers)) {
    return `Question #${index + 1}: the "answers" field must be an array`
  }

  if (q.answers.length < 2) {
    return `Question #${index + 1}: at least 2 answer options are required`
  }

  if (q.answers.length > 6) {
    return `Question #${index + 1}: maximum 6 answer options are allowed`
  }

  for (let i = 0; i < q.answers.length; i++) {
    if (typeof q.answers[i] !== 'string' || (q.answers[i] as string).trim() === '') {
      return `Question #${index + 1}: answer #${i + 1} must be a non-empty string`
    }
  }

  if (q.timeLimit !== undefined) {
    if (typeof q.timeLimit !== 'number' || q.timeLimit < 5 || q.timeLimit > 120) {
      return `Question #${index + 1}: "timeLimit" must be a number from 5 to 120`
    }
  }

  return null
}

export async function parseQuestionsJSON(
    raw: string
): Promise<ParseResult | ParseError> {
  // async so fetch/API validation can be added later
  await Promise.resolve()

  if (raw.trim() === '') {
    return { success: false, error: 'Field cannot be empty' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { success: false, error: 'Invalid JSON. Check the syntax.' }
  }

  // Support both formats: an array or { questions: [...] }
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
      error: 'Expected an array of questions or an object with a "questions" field',
    }
  }

  if (items.length === 0) {
    return { success: false, error: 'Question list is empty' }
  }

  // Validate each question
  for (let i = 0; i < items.length; i++) {
    const err = validateQuestion(items[i], i)
    if (err) return { success: false, error: err }
  }

  // Convert to our DraftQuestion type
  const questions: DraftQuestion[] = (items as ImportedQuestion[]).map(item => ({
    text: item.text.trim(),
    answers: item.answers.map(a => a.trim()) as [string, ...string[]],
    ...(item.timeLimit !== undefined ? { timeLimit: item.timeLimit } : {}),
  }))

  return { success: true, questions }
}

/**
 * Example JSON for the textarea placeholder
 */
export const EXAMPLE_QUESTIONS_JSON = JSON.stringify(
    [
      {
        text: 'In which city is the famous Bellagio casino located?',
        answers: ['LAS VEGAS', 'MONACO', 'MACAU', 'LONDON'],
        timeLimit: 15,
      },
      {
        text: 'Which card game is most commonly played in casinos?',
        answers: ['POKER', 'BRIDGE', 'UNO', 'PREFRANCE'],
      },
      {
        text: 'Which symbol is most commonly found on slot machines?',
        answers: ['SEVEN', 'CHERRY', 'STAR', 'BELL'],
      },
    ],
    null,
    2
)