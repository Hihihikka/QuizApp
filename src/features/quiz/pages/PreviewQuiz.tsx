import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { quizService } from '../quizService'
import type { QuizDifficulty } from '../types'
import Button from '../../../components/ui/Button'
import QuizFormSection from '../components/QuizFormSection'
import QuestionPreviewList from '../components/QuestionPreviewList'
import styles from './PreviewQuiz.module.css'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DIFFICULTY_LABEL: Record<QuizDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const DIFFICULTY_DOT: Record<QuizDifficulty, string> = {
  easy: styles.dotEasy,
  medium: styles.dotMedium,
  hard: styles.dotHard,
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreviewQuiz() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()

  const quiz = useMemo(
    () => (quizId ? quizService.getById(quizId) : undefined),
    [quizId]
  )

  if (!quiz) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Quiz not found</h1>
          <p className={styles.description}>
            This quiz doesn't exist or has been deleted.
          </p>
        </div>
        <div className={styles.footer}>
          <Button type="button" onClick={() => navigate('/app/quizzes')}>
            Back to quizzes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      {/* ── Header (fixed) ──────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>{quiz.title}</h1>
        {quiz.description && (
          <p className={styles.description}>{quiz.description}</p>
        )}
        <div className={styles.meta}>
          <span className={`${styles.metaBadge} ${styles.metaBadgeHighlight}`}>
            {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
          </span>
          <span className={styles.metaBadge}>
            <span className={`${styles.dot} ${DIFFICULTY_DOT[quiz.difficulty]}`} />
            {DIFFICULTY_LABEL[quiz.difficulty]}
          </span>
          <span className={styles.metaBadge}>
            ⏱ {quiz.defaultTimeLimit}s / question
          </span>
        </div>
      </div>

      {/* ── Questions (scrollable) ───────────────────────────────────────── */}
      <div className={styles.questionsWrap}>
        <QuizFormSection
          title="Questions"
          badge={quiz.questions.length}
        >
          <QuestionPreviewList questions={quiz.questions} />
        </QuizFormSection>
      </div>

      {/* ── Actions (fixed) ─────────────────────────────────────────────── */}
      <div className={styles.footer}>
        <Button type="button" onClick={() => navigate('/app/quizzes')}>
          Back
        </Button>
        <div className={styles.footerSpacer} />
        <Button
          type="button"
          onClick={() => navigate(`/app/quizzes/${quiz.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          variant="primary"
          size="lg"
          type="button"
          onClick={() => navigate(`/play/${quiz.id}`)}
        >
          ▶ Play
        </Button>
      </div>

    </div>
  )
}