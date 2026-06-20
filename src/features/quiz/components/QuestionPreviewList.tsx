import type { Question, DraftQuestion } from '../types'
import styles from './QuestionPreviewList.module.css'

interface QuestionPreviewListProps {
    questions: (Question | DraftQuestion)[]
    onRemove?: (index: number) => void
}

export default function QuestionPreviewList({
                                                questions,
                                                onRemove,
                                            }: QuestionPreviewListProps) {
    return (
        <ul className={styles.list}>
            {questions.map((q, i) => (
                <li key={'id' in q ? q.id : i} className={styles.item}>
                    <div className={styles.header}>
                        <span className={styles.index}>#{i + 1}</span>
                        <span className={styles.text}>{q.text}</span>
                        {onRemove && (
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => onRemove(i)}
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