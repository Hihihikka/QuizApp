// Единственный источник правды для допустимого диапазона времени на вопрос
// (в секундах). Импортируется и фронтом, и бэком как @quizapp/shared —
// НЕ дублировать magic numbers в другом месте. Если меняешь диапазон —
// меняй только здесь, затем `npm run build -w shared` (или просто
// перезапусти dev-режим, если используешь tsc --watch).
export const TIME_LIMIT_MIN = 5
export const TIME_LIMIT_MAX = 120

export function isValidTimeLimit(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
      && value >= TIME_LIMIT_MIN && value <= TIME_LIMIT_MAX
}