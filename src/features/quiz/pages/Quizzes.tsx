import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import Button from '../../../components/ui/Button'
import styles from './Quizzes.module.css'

export default function Quizzes() {
  const navigate = useNavigate()
  const { quizzes, deleteQuiz, loading } = useQuizStore()

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation() // don't open preview when clicking Delete
    if (!confirm('Delete quiz?')) return
    await deleteQuiz(id)
  }

  function handleEdit(e: React.MouseEvent, id: string) {
    e.stopPropagation() // don't open preview when clicking Edit
    navigate(`/app/quizzes/${id}/edit`)
  }

  function handlePlay(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    navigate(`/play/${id}`)
  }

  return (
    <div className={styles.quizzesPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>My quizzes</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/app/quizzes/create')}
        >
          + Create quiz
        </Button>
      </div>

      {quizzes.length === 0 ? (
        <div className={styles.empty}>
          <p>No quizzes yet.</p>
          <Button
            variant="primary"
            onClick={() => navigate('/app/quizzes/create')}
          >
            Create first quiz
          </Button>
        </div>
      ) : (
        <ul className={styles.list}>
          {quizzes.map(quiz => (
            <li
              key={quiz.id}
              className={styles.card}
              onClick={() => navigate(`/app/quizzes/${quiz.id}/preview`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/app/quizzes/${quiz.id}/preview`)
                }
              }}
            >
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
                <Button
                  variant="primary"
                  size="sm"
                  onClick={e => handlePlay(e, quiz.id)}
                >
                  Play
                </Button>
                <Button size="sm" onClick={e => handleEdit(e, quiz.id)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={e => handleDelete(e, quiz.id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
