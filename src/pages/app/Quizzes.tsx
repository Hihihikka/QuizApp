import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../features/quiz/useQuizStore'

export default function Quizzes() {
  const navigate = useNavigate()
  const { quizzes, deleteQuiz, loading } = useQuizStore()

  async function handleDelete(id: string) {
    if (!confirm('Delete quiz?')) return
    await deleteQuiz(id)
  }

  return (
    <div className="quizzes-page">
      <div className="quizzes-page__header">
        <h1>My quizzes</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate('/app/quizzes/create')}
        >
          + Create quiz
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="quizzes-page__empty">
          <p>No quizzes yet.</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/app/quizzes/create')}
          >
            Create first quiz
          </button>
        </div>
      ) : (
        <ul className="quiz-list">
          {quizzes.map(quiz => (
            <li key={quiz.id} className="quiz-card">
              <div className="quiz-card__info">
                <h2 className="quiz-card__title">{quiz.title}</h2>
                {quiz.description && (
                  <p className="quiz-card__description">{quiz.description}</p>
                )}
                <div className="quiz-card__meta">
                  <span>{quiz.questions.length} questions</span>
                  <span>{quiz.difficulty}</span>
                  <span>{quiz.defaultTimeLimit}s/question</span>
                </div>
              </div>
              <div className="quiz-card__actions">
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => navigate(`/play/${quiz.id}`)}
                >
                  Play
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => navigate(`/app/quizzes/${quiz.id}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--danger btn--sm"
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
