import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../../features/quiz/useQuizStore'
import { parseQuestionsJSON, EXAMPLE_QUESTIONS_JSON } from '../../features/quiz/quizParser'
import type { Question, QuizDifficulty } from '../../features/quiz/types'

// ─── Local form type ──────────────────────────────────────────────────────────

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

// ─── Question input mode tabs ─────────────────────────────────────────────────

type QuestionInputMode = 'manual' | 'json'

// ─── Component ────────────────────────────────────────────────────────────────

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

  // ─── Form handlers ─────────────────────────────────────────────────────────

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

  // ─── Remove a single question from the preview ─────────────────────────────

  function handleRemoveQuestion(id: string) {
    setQuestions(prev => prev.filter(q => q.id !== id))
    if (questions.length <= 1) setJsonSuccess(false)
  }

  // ─── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (form.title.trim() === '') {
      setSubmitError('Enter the quiz title')
      return
    }
    if (questions.length === 0) {
      setSubmitError('Add at least one question')
      return
    }

    try {
      const quiz = await createQuiz({
        ...form,
        questions,
      })
      navigate(`/app/quizzes/${quiz.id}`)
    } catch {
      setSubmitError('Failed to save quiz')
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="create-quiz">
      <div className="create-quiz__header">
        <h1 className="create-quiz__title">New quiz</h1>
        <p className="create-quiz__subtitle">Fill in data and add questions</p>
      </div>

      <form className="create-quiz__form" onSubmit={handleSubmit} noValidate>

        {/* ── Metadata ─────────────────────────────────────────────── */}
        <section className="create-quiz__section">
          <h2 className="create-quiz__section-title">Basics</h2>

          <div className="form-field">
            <label className="form-field__label" htmlFor="title">
              Name <span className="form-field__required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-field__input"
              value={form.title}
              onChange={handleFormChange}
              placeholder="For example: Casinos and gambling"
              maxLength={100}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-field__label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-field__textarea"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Brief description of the quiz (optional)"
              rows={2}
              maxLength={300}
            />
          </div>

          <div className="form-field-row">
            <div className="form-field">
              <label className="form-field__label" htmlFor="difficulty">
                Complexity
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-field__select"
                value={form.difficulty}
                onChange={handleFormChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="defaultTimeLimit">
                Time for a question (sec)
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

        {/* ── Questions ────────────────────────────────────────────── */}
        <section className="create-quiz__section">
          <h2 className="create-quiz__section-title">
            Questions
            {questions.length > 0 && (
              <span className="create-quiz__question-count">{questions.length}</span>
            )}
          </h2>

          {/* Mode switcher */}
          <div className="mode-tabs">
            <button
              type="button"
              className={`mode-tab ${mode === 'json' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('json')}
            >
              JSON-import
            </button>
            <button
              type="button"
              className={`mode-tab ${mode === 'manual' ? 'mode-tab--active' : ''}`}
              onClick={() => setMode('manual')}
            >
              Manually
            </button>
          </div>

          {/* JSON mode */}
          {mode === 'json' && (
            <div className="json-import">
              <div className="json-import__toolbar">
                <span className="json-import__hint">
                  Paste the questions array in JSON format.{' '}
                  <code>answers[0]</code> — correct answer.
                </span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={handleLoadExample}
                >
                  Load example
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
                placeholder={`[\n  {\n    "text": "Question?",\n    "answers": ["CORRECT", "WRONG 1", "WRONG 2"],\n    "timeLimit": 15\n  }\n]`}
                rows={12}
                spellCheck={false}
              />

              {jsonError && (
                <p className="json-import__error">⚠ {jsonError}</p>
              )}

              {jsonSuccess && (
                <p className="json-import__success">
                  ✓ Uploaded {questions.length} question(s)
                </p>
              )}

              <div className="json-import__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleParseJSON}
                  disabled={isParsing || jsonInput.trim() === ''}
                >
                  {isParsing ? 'Parsing...' : 'Import questions'}
                </button>

                {jsonInput && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleClearJSON}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual mode placeholder, implement in the next iteration */}
          {mode === 'manual' && (
            <div className="manual-notice">
              <p>Manual addition of questions is in development.</p>
              <p>Use JSON import for quick populating.</p>
            </div>
          )}
        </section>

        {/* ── Question preview ────────────────────────────────────── */}
        {questions.length > 0 && (
          <section className="create-quiz__section">
            <h2 className="create-quiz__section-title">Question preview</h2>
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
                      title="Remove question"
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
                    <span className="question-preview__time">⏱ {q.timeLimit}s</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Error and save button ───────────────────────────────── */}
        {submitError && (
          <p className="create-quiz__submit-error">⚠ {submitError}</p>
        )}

        <div className="create-quiz__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate('/app/quizzes')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create a quiz'}
          </button>
        </div>

      </form>
    </div>
  )
}
