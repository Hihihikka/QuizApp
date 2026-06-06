import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import type { Question, QuizDifficulty } from '../types'
import Button from '../../../components/ui/Button'
import QuizFormSection from '../components/QuizFormSection'
import QuizMetaFields from '../components/QuizMetaFields'
import type { QuizMetaValues } from '../components/QuizMetaFields'
import JsonImportSection from '../components/JsonImportSection'
import QuestionPreviewList from '../components/QuestionPreviewList'
import styles from './quizForm.module.css'

type QuestionInputMode = 'manual' | 'json'

const INITIAL_FORM: QuizMetaValues = {
  title: '',
  description: '',
  difficulty: 'medium' as QuizDifficulty,
  defaultTimeLimit: 15,
}

export default function CreateQuiz() {
  const navigate = useNavigate()
  const { createQuiz, loading } = useQuizStore()

  const [form, setForm] = useState<QuizMetaValues>(INITIAL_FORM)
  const [questions, setQuestions] = useState<Question[]>([])
  const [mode, setMode] = useState<QuestionInputMode>('json')
  const [submitError, setSubmitError] = useState<string | null>(null)

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
    setQuestions(imported)
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
      const quiz = await createQuiz({ ...form, questions })
      navigate(`/app/quizzes/${quiz.id}/preview`)
    } catch {
      setSubmitError('Failed to save quiz')
    }
  }

  return (
    <div className={styles.quizPage}>

      {/* Fixed header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>New quiz</h1>
        <p className={styles.subtitle}>Fill in data and add questions</p>
      </div>

      {/* Scrollable form content — id ties submit button outside */}
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
            <JsonImportSection onImport={handleImport} />
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
        {submitError && (
          <p className={styles.submitError}>⚠ {submitError}</p>
        )}
        <div className={styles.footerSpacer} />
        <Button type="button" onClick={() => navigate('/app/quizzes')}>
          Cancel
        </Button>
        {/* form= attribute links this button to the form above */}
        <Button variant="primary" size="lg" type="submit" form="quiz-form" disabled={loading}>
          {loading ? 'Saving...' : 'Create a quiz'}
        </Button>
      </div>

    </div>
  )
}