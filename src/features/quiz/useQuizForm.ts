import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from './useQuizStore'
import { quizService } from './quizService'
import type { Quiz, Question, DraftQuestion } from './types'
import type { QuizMetaValues } from './components/QuizMetaFields'
import { TIME_LIMIT_MIN, TIME_LIMIT_MAX } from '@quizapp/shared'

interface UseQuizFormOptions {
  quizId?: string
}

export function useQuizForm({ quizId }: UseQuizFormOptions = {}) {
  const navigate = useNavigate()
  const { createQuiz, updateQuiz, deleteQuiz, loading } = useQuizStore()

  const isEditMode = Boolean(quizId)

  const [existingQuiz, setExistingQuiz] = useState<Quiz | undefined>(undefined)

  const [form, setForm] = useState<QuizMetaValues>({
    title: '',
    description: '',
    difficulty: 'medium',
    defaultTimeLimit: 15,
  })

  // Локально список может содержать как уже сохранённые вопросы (Question, при
  // редактировании существующего квиза), так и черновики из импорта (DraftQuestion).
  const [questions, setQuestions] = useState<(Question | DraftQuestion)[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // ── Загружаем квиз если edit mode ─────────────────────────────────────────

  useEffect(() => {
    if (!quizId) return
    quizService.getById(quizId).then(quiz => {
      setExistingQuiz(quiz)
      setForm({
        title: quiz.title,
        description: quiz.description ?? '',
        difficulty: quiz.difficulty,
        defaultTimeLimit: quiz.defaultTimeLimit,
      })
      setQuestions(quiz.questions)
    })
  }, [quizId])

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleFormChange(
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target

    if (name === 'defaultTimeLimit') {
      // type="number" на инпуте не блокирует ручной ввод вне min/max и не
      // защищает от NaN при пустом/нечисловом значении — поэтому здесь
      // санитизация, а не просто Number(value).
      const num = Number(value)
      setForm(prev => ({
        ...prev,
        defaultTimeLimit: Number.isFinite(num) ? num : prev.defaultTimeLimit,
      }))
      return
    }

    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImport(imported: DraftQuestion[]) {
    if (isEditMode) {
      setQuestions(prev => [...prev, ...imported])
    } else {
      setQuestions(imported)
    }
  }

  function handleRemoveQuestion(index: number) {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (form.title.trim() === '') {
      setSubmitError('Enter the quiz title')
      return
    }
    if (form.defaultTimeLimit < TIME_LIMIT_MIN || form.defaultTimeLimit > TIME_LIMIT_MAX) {
      setSubmitError(`Time per question must be between ${TIME_LIMIT_MIN} and ${TIME_LIMIT_MAX} seconds`)
      return
    }
    if (questions.length === 0) {
      setSubmitError('Add at least one question')
      return
    }

    // Бэк сам присваивает id/quizId при сохранении — отправляем вопросы
    // в форме DraftQuestion независимо от того, пришли они уже сохранёнными
    // (Question, при редактировании) или как черновик (DraftQuestion, импорт).
    const questionsForSubmit = questions.map(({ text, answers, timeLimit }) => ({
      text,
      answers,
      ...(timeLimit !== undefined ? { timeLimit } : {}),
    }))

    try {
      if (isEditMode) {
        await updateQuiz(quizId!, { ...form, questions: questionsForSubmit })
        navigate('/app/quizzes')
      } else {
        const quiz = await createQuiz({ ...form, questions: questionsForSubmit })
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
    form,
    questions,
    existingQuiz,
    isEditMode,
    loading,
    submitError,
    confirmDelete,
    handleFormChange,
    handleImport,
    handleRemoveQuestion,
    handleSubmit,
    handleDelete,
  }
}