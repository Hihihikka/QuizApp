import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuizForm } from '../useQuizForm'
import Button from '../../../components/ui/Button'
import QuizFormSection from '../components/QuizFormSection'
import QuizMetaFields from '../components/QuizMetaFields'
import JsonImportSection from '../components/JsonImportSection'
import QuestionPreviewList from '../components/QuestionPreviewList'
import layout from './quizPageLayout.module.css'
import styles from './quizForm.module.css'

type QuestionInputMode = 'manual' | 'json'

export default function EditQuiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const [mode, setMode] = useState<QuestionInputMode>('json')

  const {
    form,
    questions,
    existingQuiz,
    loading,
    submitError,
    confirmDelete,
    handleFormChange,
    handleImport,
    handleRemoveQuestion,
    handleSubmit,
    handleDelete,
  } = useQuizForm({ quizId })

  if (!existingQuiz) {
    return (
      <div className={layout.page}>
        <div className={layout.pageHeader}>
          <h1 className={layout.title}>Quiz not found</h1>
          <p className={layout.subtitle}>
            The quiz you're looking for doesn't exist or has been deleted.
          </p>
        </div>
        <div className={layout.footer}>
          <Button type="button" onClick={() => navigate('/app/quizzes')}>
            Back to quizzes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={layout.page}>

      <div className={layout.pageHeader}>
        <h1 className={layout.title}>Edit quiz</h1>
        <p className={layout.subtitle}>Update questions or quiz settings</p>
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

      <div className={layout.footer}>
        <Button
          variant="danger"
          type="button"
          onClick={handleDelete}
          disabled={loading}
        >
          {confirmDelete ? 'Confirm delete' : 'Delete quiz'}
        </Button>
        <div className={layout.footerSpacer} />
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
