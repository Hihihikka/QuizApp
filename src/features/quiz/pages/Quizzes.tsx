import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import styles from './Quizzes.module.css'

export default function Quizzes() {
  const navigate = useNavigate()
  const { quizzes, deleteQuiz, loading } = useQuizStore()

  async function handleDelete(id: string) {
    if (!confirm('Delete quiz?')) return
    await deleteQuiz(id)
  }

  return (
    <div className={styles.quizzesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>My quizzes</h1>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => navigate('/app/quizzes/create')}
        >
          + Create quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className={styles.empty}>
          <p>No quizzes yet.</p>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate('/app/quizzes/create')}
          >
            Create first quiz
          </button>
        </div>
      ) : (
        <ul className={styles.list}>
          {quizzes.map(quiz => (
            <li key={quiz.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <h2 className={styles.cardTitle}>{quiz.title}</h2>
                {quiz.description && (
                  <p className={styles.cardDescription}>{quiz.description}</p>
                )}
                <div className={styles.cardMeta}>
                  <span>{quiz.questions.length} questions</span>
                  <span>{quiz.difficulty}</span>
                  <span>{quiz.defaultTimeLimit}s / question</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => navigate(`/play/${quiz.id}`)}
                >
                  Play
                </button>
                <button
                  className={styles.btn}
                  onClick={() => navigate(`/app/quizzes/${quiz.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleDelete(quiz.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
