import type { Question } from '../types'
import styles from './QuestionPreviewList.module.css'

interface QuestionPreviewListProps {
  questions: Question[]
  /** If provided, shows a remove button on each item */
  onRemove?: (id: string) => void
}

export default function QuestionPreviewList({
  questions,
  onRemove,
}: QuestionPreviewListProps) {
  return (
    <ul className={styles.list}>
      {questions.map((q, i) => (
        <li key={q.id} className={styles.item}>
          <div className={styles.header}>
            <span className={styles.index}>#{i + 1}</span>
            <span className={styles.text}>{q.text}</span>
            {onRemove && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemove(q.id)}
                title="Remove question"
              >
                ✕
              </button>
            )}
          </div>

          <ul className={styles.answers}>
            {q.answers.map((a, ai) => (
              <li
                key={ai}
                className={`${styles.answer} ${ai === 0 ? styles.answerCorrect : ''}`}
              >
                {ai === 0 && <span className={styles.correctMark}>✓</span>}
                {a}
              </li>
            ))}
          </ul>

          {q.timeLimit && (
            <span className={styles.timeLimit}>⏱ {q.timeLimit}s</span>
          )}
        </li>
      ))}
    </ul>
  )
}
