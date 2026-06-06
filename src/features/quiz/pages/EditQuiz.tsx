import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import { quizService } from '../quizService'
import type { Question } from '../types'
import Button from '../../../components/ui/Button'
import QuizFormSection from '../components/QuizFormSection'
import QuizMetaFields from '../components/QuizMetaFields'
import type { QuizMetaValues } from '../components/QuizMetaFields'
import JsonImportSection from '../components/JsonImportSection'
import QuestionPreviewList from '../components/QuestionPreviewList'
import styles from './quizForm.module.css'

type QuestionInputMode = 'manual' | 'json'

export default function EditQuiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { updateQuiz, deleteQuiz, loading } = useQuizStore()

  const existingQuiz = useMemo(
    () => (quizId ? quizService.getById(quizId) : undefined),
    [quizId]
  )

  const [form, setForm] = useState<QuizMetaValues>(() => ({
    title: existingQuiz?.title ?? '',
    description: existingQuiz?.description ?? '',
    difficulty: existingQuiz?.difficulty ?? 'medium',
    defaultTimeLimit: existingQuiz?.defaultTimeLimit ?? 15,
  }))
  const [questions, setQuestions] = useState<Question[]>(
    () => existingQuiz?.questions ?? []
  )
  const [mode, setMode] = useState<QuestionInputMode>('json')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'defaultTimeLimit' ? Number(value) : value,
    }))
  }

  function handleImport(imported: Question[]) {
    setQuestions(prev => [...prev, ...imported])
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
      await updateQuiz(quizId!, { ...form, questions })
      navigate('/app/quizzes')
    } catch {
      setSubmitError('Failed to save changes')
    }
  }

  async function handleDelete() {
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

  if (!existingQuiz) {
    return (
      <div className={styles.quizPage}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Quiz not found</h1>
          <p className={styles.subtitle}>
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
        </div>
        <div className={styles.formFooter}>
          <Button type="button" onClick={() => navigate('/app/quizzes')}>
            Back to quizzes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.quizPage}>

      {/* Fixed header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Edit quiz</h1>
        <p className={styles.subtitle}>Update questions or quiz settings</p>
      </div>

      {/* Scrollable form content */}
      <form id="quiz-form" className={styles.form} onSubmit={handleSubmit} noValidate>

        <QuizFormSection title="Basics">
          <QuizMetaFields values={form} onChange={handleFormChange} />
        </QuizFormSection>

        <QuizFormSection
          title="Questions"
          badge={questions.length > 0 ? questions.length : undefined}
        >
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTab} ${mode === 'json' ? styles.modeTabActive : ''}`}
              onClick={() => setMode('json')}
            >
              JSON-import
            </button>
            <button
              type="button"
              className={`${styles.modeTab} ${mode === 'manual' ? styles.modeTabActive : ''}`}
              onClick={() => setMode('manual')}
            >
              Manually
            </button>
          </div>

          {mode === 'json' && (
            <JsonImportSection
              hint="Imported questions will be added to existing ones. answers[0] — correct answer."
              rows={10}
              onImport={handleImport}
            />
          )}

          {mode === 'manual' && (
            <div className={styles.manualNotice}>
              <p>Manual addition of questions is in development.</p>
              <p>Use JSON import for quick populating.</p>
            </div>
          )}
        </QuizFormSection>

        {questions.length > 0 && (
          <QuizFormSection title="Question preview">
            <QuestionPreviewList
              questions={questions}
              onRemove={handleRemoveQuestion}
            />
          </QuizFormSection>
        )}

      </form>

      {/* Fixed footer — outside scroll area */}
      <div className={styles.formFooter}>
        <Button
          variant="danger"
          type="button"
          onClick={handleDelete}
          disabled={loading}
        >
          {confirmDelete ? 'Confirm delete' : 'Delete quiz'}
        </Button>
        <div className={styles.footerSpacer} />
        {submitError && (
          <p className={styles.submitError}>⚠ {submitError}</p>
        )}
        <Button type="button" onClick={() => navigate('/app/quizzes')}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" type="submit" form="quiz-form" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </Button>
      </div>

    </div>
  )
}