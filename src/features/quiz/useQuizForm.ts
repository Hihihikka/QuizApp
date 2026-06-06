import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from './useQuizStore'
import { quizService } from './quizService'
import type { Question } from './types'
import type { QuizMetaValues } from './components/QuizMetaFields'

interface UseQuizFormOptions {
  /** Pass quizId to switch the hook into edit mode */
  quizId?: string
}

export function useQuizForm({ quizId }: UseQuizFormOptions = {}) {
  const navigate = useNavigate()
  const { createQuiz, updateQuiz, deleteQuiz, loading } = useQuizStore()

  const isEditMode = Boolean(quizId)

  const existingQuiz = useMemo(
    () => (quizId ? quizService.getById(quizId) : undefined),
    [quizId]
  )

  // ── Form state ──────────────────────────────────────────────────────────────

  const [form, setForm] = useState<QuizMetaValues>(() => ({
    title: existingQuiz?.title ?? '',
    description: existingQuiz?.description ?? '',
    difficulty: existingQuiz?.difficulty ?? 'medium',
    defaultTimeLimit: existingQuiz?.defaultTimeLimit ?? 15,
  }))

  const [questions, setQuestions] = useState<Question[]>(
    () => existingQuiz?.questions ?? []
  )

  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Delete state (edit mode only) ──────────────────────────────────────────

  const [confirmDelete, setConfirmDelete] = useState(false)

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'defaultTimeLimit' ? Number(value) : value,
    }))
  }

  /**
   * Create: replaces the whole list (re-import creates a new question set).
   * Edit: appends to existing questions (additional questions can be imported).
   */
  function handleImport(imported: Question[]) {
    if (isEditMode) {
      setQuestions(prev => [...prev, ...imported])
    } else {
      setQuestions(imported)
    }
  }

  function handleRemoveQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (form.title.trim() === '') {
      setSubmitError('Enter the quiz title')
      return
    }
    if (questions.length === 0) {
      setSubmitError('Add at least one question')
      return
    }

    try {
      if (isEditMode) {
        await updateQuiz(quizId!, { ...form, questions })
        navigate('/app/quizzes')
      } else {
        const quiz = await createQuiz({ ...form, questions })
        navigate(`/app/quizzes/${quiz.id}/preview`)
      }
    } catch {
      setSubmitError(isEditMode ? 'Failed to save changes' : 'Failed to save quiz')
    }
  }

  async function handleDelete() {
    if (!isEditMode) return

    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }

    try {
      await deleteQuiz(quizId!)
      navigate('/app/quizzes')
    } catch {
      setSubmitError('Failed to delete quiz')
    }
  }

  return {
    // data
    form,
    questions,
    existingQuiz,
    isEditMode,
    // statuses
    loading,
    submitError,
    confirmDelete,
    // handlers
    handleFormChange,
    handleImport,
    handleRemoveQuestion,
    handleSubmit,
    handleDelete,
  }
}
