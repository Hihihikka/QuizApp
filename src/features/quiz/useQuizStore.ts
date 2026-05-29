import { useState, useCallback } from 'react'
import { quizService } from './quizService'
import type { Quiz, CreateQuizDTO, UpdateQuizDTO } from './types'

/**
 * Хук-обёртка над quizService для React-компонентов.
 * Хранит список квизов в локальном стейте и синхронизирует с localStorage.
 *
 * В будущем: заменить тело функций на fetch-вызовы к API —
 * интерфейс хука при этом не изменится, компоненты не сломаются.
 */
export function useQuizStore() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => quizService.getAll())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(() => {
    setQuizzes(quizService.getAll())
  }, [])

  const createQuiz = useCallback(
    async (dto: CreateQuizDTO): Promise<Quiz> => {
      setLoading(true)
      setError(null)
      try {
        // async/await готов к замене на fetch()
        const quiz = await Promise.resolve(quizService.create(dto))
        setQuizzes(prev => [...prev, quiz])
        return quiz
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка создания квиза'
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateQuiz = useCallback(
    async (id: string, dto: UpdateQuizDTO): Promise<Quiz> => {
      setLoading(true)
      setError(null)
      try {
        const updated = await Promise.resolve(quizService.update(id, dto))
        setQuizzes(prev => prev.map(q => (q.id === id ? updated : q)))
        return updated
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка обновления квиза'
        setError(msg)
        throw e
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const deleteQuiz = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await Promise.resolve(quizService.delete(id))
      setQuizzes(prev => prev.filter(q => q.id !== id))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Ошибка удаления квиза'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    quizzes,
    loading,
    error,
    refresh,
    createQuiz,
    updateQuiz,
    deleteQuiz,
  }
}
