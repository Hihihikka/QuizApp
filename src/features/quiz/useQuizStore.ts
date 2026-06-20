import { useState, useCallback, useEffect } from 'react'
import { quizService } from './quizService'
import type { Quiz, CreateQuizDTO, UpdateQuizDTO } from './types'

export function useQuizStore() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await quizService.getAll()
      setQuizzes(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createQuiz = useCallback(async (dto: CreateQuizDTO): Promise<Quiz> => {
    setLoading(true)
    setError(null)
    try {
      const quiz = await quizService.create(dto)
      setQuizzes(prev => [quiz, ...prev])
      return quiz
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create quiz'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuiz = useCallback(async (id: string, dto: UpdateQuizDTO): Promise<Quiz> => {
    setLoading(true)
    setError(null)
    try {
      const updated = await quizService.update(id, dto)
      setQuizzes(prev => prev.map(q => (String(q.id) === id ? updated : q)))
      return updated
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update quiz'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteQuiz = useCallback(async (id: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await quizService.delete(id)
      setQuizzes(prev => prev.filter(q => String(q.id) !== id))
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to delete quiz'
      setError(msg)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { quizzes, loading, error, refresh, createQuiz, updateQuiz, deleteQuiz }
}