import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizForm } from '../useQuizForm'
import Button from '../../../components/ui/Button'
import QuizFormSection from '../components/QuizFormSection'
import QuizMetaFields from '../components/QuizMetaFields'
import JsonImportSection from '../components/JsonImportSection'
import QuestionPreviewList from '../components/QuestionPreviewList'
import layout from './quizPageLayout.module.css'
import styles from './quizForm.module.css'

type QuestionInputMode = 'manual' | 'json'

export default function CreateQuiz() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<QuestionInputMode>('json')

  const {
    form,
    questions,
    loading,
    submitError,
    handleFormChange,
    handleImport,
    handleRemoveQuestion,
    handleSubmit,
  } = useQuizForm()

  return (
    <div className={layout.page}>

      <div className={layout.pageHeader}>
        <h1 className={layout.title}>New quiz</h1>
        <p className={layout.subtitle}>Fill in data and add questions</p>
      </div>

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

      <div className={layout.footer}>
        {submitError && (
          <p className={styles.submitError}>⚠ {submitError}</p>
        )}
        <div className={layout.footerSpacer} />
        <Button type="button" onClick={() => navigate('/app/quizzes')}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" type="submit" form="quiz-form" disabled={loading}>
          {loading ? 'Saving...' : 'Create a quiz'}
        </Button>
      </div>

    </div>
  )
}
