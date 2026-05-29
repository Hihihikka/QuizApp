import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../features/quiz/useQuizStore'
import { parseQuestionsJSON, EXAMPLE_QUESTIONS_JSON } from '../../features/quiz/quizParser'
import type { Question, QuizDifficulty } from '../../features/quiz/types'

// ─── Локальный тип формы ──────────────────────────────────────────────────────

interface QuizFormState {
  title: string
  description: string
  difficulty: QuizDifficulty
  defaultTimeLimit: number
}

const INITIAL_FORM: QuizFormState = {
  title: '',
  description: '',
  difficulty: 'medium',
  defaultTimeLimit: 15,
}

// ─── Вкладки режима добавления вопросов ───────────────────────────────────────

type QuestionInputMode = 'manual' | 'json'

// ─── Компонент ────────────────────────────────────────────────────────────────

export default function CreateQuiz() {
  const navigate = useNavigate()
  const { createQuiz, loading } = useQuizStore()

  const [form, setForm] = useState<QuizFormState>(INITIAL_FORM)
  const [questions, setQuestions] = useState<Question[]>([])
  const [mode, setMode] = useState<QuestionInputMode>('json')

  // JSON import state
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [jsonSuccess, setJsonSuccess] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  // General form error
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ─── Обработчики формы ──────────────────────────────────────────────────────

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'defaultTimeLimit' ? Number(value) : value,
    }))
  }

  // ─── JSON import ────────────────────────────────────────────────────────────

  async function handleParseJSON() {
    setJsonError(null)
    setJsonSuccess(false)
    setIsParsing(true)

    try {
      const result = await parseQuestionsJSON(jsonInput)

      if (!result.success) {
        setJsonError(result.error)
        return
      }

      setQuestions(result.questions)
      setJsonSuccess(true)
    } finally {
      setIsParsing(false)
    }
  }

  function handleLoadExample() {
    setJsonInput(EXAMPLE_QUESTIONS_JSON)
    setJsonError(null)
    setJsonSuccess(false)
  }

  function handleClearJSON() {
    setJsonInput('')
    setJsonError(null)
    setJsonSuccess(false)
    setQuestions([])
  }

  // ─── Удаление отдельного вопроса из превью ───────────────────────────────────

  function handleRemoveQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
    if (questions.length <= 1) setJsonSuccess(false)
  }

  // ─── Сабмит ─────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (form.title.trim() === '') {
      setSubmitError('Введите название квиза')
      return
    }
    if (questions.length === 0) {
      setSubmitError('Добавьте хотя бы один вопрос')
      return
    }

    try {
      const quiz = await createQuiz({
        ...form,
        questions,
      })
      navigate(`/app/quizzes/${quiz.id}`)
    } catch {
      setSubmitError('Не удалось сохранить квиз')
    }
  }

  // ─── Рендер ──────────────────────────────────────────────────────────────────

  return (
    <div className="create-quiz">
      <div className="create-quiz__header">
        <h1 className="create-quiz__title">Новый квиз</h1>
        <p className="create-quiz__subtitle">Заполните данные и добавьте вопросы</p>
      </div>

      <form className="create-quiz__form" onSubmit={handleSubmit} noValidate>

        {/* ── Мета-данные ─────────────────────────────────────────── */}
        <section className="create-quiz__section">
          <h2 className="create-quiz__section-title">Основное</h2>

          <div className="form-field">
            <label className="form-field__label" htmlFor="title">
              Название <span className="form-field__required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-field__input"
              value={form.title}
              onChange={handleFormChange}
              placeholder="Например: Казино и азартные игры"
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="description">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              className="form-field__textarea"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Краткое описание квиза (опционально)"
              rows={2}
              maxLength={300}
            />
          </div>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-field__label" htmlFor="difficulty">
                Сложность
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-field__select"
                value={form.difficulty}
                onChange={handleFormChange}
              >
                <option value="easy">Лёгкий</option>
                <option value="medium">Средний</option>
                <option value="hard">Сложный</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="defaultTimeLimit">
                Время на вопрос (сек)
              </label>
              <input
                id="defaultTimeLimit"
                name="defaultTimeLimit"
                type="number"
                className="form-field__input"
                value={form.defaultTimeLimit}
                onChange={handleFormChange}
                min={5}
                max={120}
              />
            </div>
          </div>
        </section>

        {/* ── Вопросы ─────────────────────────────────────────────── */}
        <section className="create-quiz__section">
          <h2 className="create-quiz__section-title">
            Вопросы
            {questions.length > 0 && (
              <span className="create-quiz__question-count">{questions.length}</span>
            )}
          </h2>

          {/* Переключатель режима */}
          <div className="mode-tabs">
            <button
              type="button"
              className={`mode-tab ${mode === 'json' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('json')}
            >
              JSON-импорт
            </button>
            <button
              type="button"
              className={`mode-tab ${mode === 'manual' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('manual')}
            >
              Вручную
            </button>
          </div>

          {/* JSON режим */}
          {mode === 'json' && (
            <div className="json-import">
              <div className="json-import__toolbar">
                <span className="json-import__hint">
                  Вставьте массив вопросов в формате JSON.{' '}
                  <code>answers[0]</code> — правильный ответ.
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={handleLoadExample}
                >
                  Загрузить пример
                </button>
              </div>

              <textarea
                className={`json-import__textarea ${jsonError ? 'json-import__textarea--error' : ''} ${jsonSuccess ? 'json-import__textarea--success' : ''}`}
                value={jsonInput}
                onChange={e => {
                  setJsonInput(e.target.value)
                  setJsonError(null)
                  setJsonSuccess(false)
                }}
                placeholder={`[\n  {\n    "text": "Вопрос?",\n    "answers": ["ПРАВИЛЬНЫЙ", "НЕВЕРНЫЙ 1", "НЕВЕРНЫЙ 2"],\n    "timeLimit": 15\n  }\n]`}
                rows={12}
                spellCheck={false}
              />

              {jsonError && (
                <p className="json-import__error">⚠ {jsonError}</p>
              )}

              {jsonSuccess && (
                <p className="json-import__success">
                  ✓ Загружено {questions.length} вопрос(ов)
                </p>
              )}

              <div className="json-import__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleParseJSON}
                  disabled={isParsing || jsonInput.trim() === ''}
                >
                  {isParsing ? 'Парсинг...' : 'Импортировать вопросы'}
                </button>

                {jsonInput && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleClearJSON}
                  >
                    Очистить
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Ручной режим — заглушка, реализовать в следующей итерации */}
          {mode === 'manual' && (
            <div className="manual-notice">
              <p>Ручное добавление вопросов — в разработке.</p>
              <p>Используйте JSON-импорт для быстрого заполнения.</p>
            </div>
          )}
        </section>

        {/* ── Превью вопросов ─────────────────────────────────────── */}
        {questions.length > 0 && (
          <section className="create-quiz__section">
            <h2 className="create-quiz__section-title">Превью вопросов</h2>
            <ul className="question-preview-list">
              {questions.map((q, i) => (
                <li key={q.id} className="question-preview">
                  <div className="question-preview__header">
                    <span className="question-preview__index">#{i + 1}</span>
                    <span className="question-preview__text">{q.text}</span>
                    <button
                      type="button"
                      className="question-preview__remove"
                      onClick={() => handleRemoveQuestion(q.id)}
                      title="Удалить вопрос"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className="question-preview__answers">
                    {q.answers.map((a, ai) => (
                      <li
                        key={ai}
                        className={`question-preview__answer ${ai === 0 ? 'question-preview__answer--correct' : ''}`}
                      >
                        {ai === 0 && <span className="question-preview__correct-mark">✓</span>}
                        {a}
                      </li>
                    ))}
                  </ul>
                  {q.timeLimit && (
                    <span className="question-preview__time">⏱ {q.timeLimit}с</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Ошибка и кнопка сохранения ──────────────────────────── */}
        {submitError && (
          <p className="create-quiz__submit-error">⚠ {submitError}</p>
        )}

        <div className="create-quiz__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate('/app/quizzes')}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Создать квиз'}
          </button>
        </div>

      </form>
    </div>
  )
}
