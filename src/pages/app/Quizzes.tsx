import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../features/quiz/useQuizStore'

export default function Quizzes() {
  const navigate = useNavigate()
  const { quizzes, deleteQuiz, loading } = useQuizStore()

  async function handleDelete(id: string) {
    if (!confirm('Удалить квиз?')) return
    await deleteQuiz(id)
  }

  return (
    <div className="quizzes-page">
      <div className="quizzes-page__header">
        <h1>Мои квизы</h1>
        <button
          className="btn btn--primary"
          onClick={() => navigate('/app/quizzes/create')}
        >
          + Создать квиз
        </button>
      </div>

      {quizzes.length === 0 ? (
        <div className="quizzes-page__empty">
          <p>Квизов пока нет.</p>
          <button
            className="btn btn--primary"
            onClick={() => navigate('/app/quizzes/create')}
          >
            Создать первый квиз
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
                  <span>{quiz.questions.length} вопр.</span>
                  <span>{quiz.difficulty}</span>
                  <span>{quiz.defaultTimeLimit}с/вопрос</span>
                </div>
              </div>
              <div className="quiz-card__actions">
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => navigate(`/play/${quiz.id}`)}
                >
                  Играть
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => navigate(`/app/quizzes/${quiz.id}/edit`)}
                >
                  Изменить
                </button>
                <button
                  className="btn btn--danger btn--sm"
                  onClick={() => handleDelete(quiz.id)}
                  disabled={loading}
                >
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
