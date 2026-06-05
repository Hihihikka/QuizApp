import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizStore } from '../useQuizStore'
import { parseQuestionsJSON, EXAMPLE_QUESTIONS_JSON } from '../quizParser'
import type { Question, QuizDifficulty } from '../types'
import styles from './CreateQuiz.module.css'

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
      const quiz = await createQuiz({ ...form, questions })
      navigate(`/app/quizzes/${quiz.id}`)
    } catch {
      setSubmitError('Failed to save quiz')
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.createQuiz}>
      <div className={styles.header}>
        <h1 className={styles.title}>New quiz</h1>
        <p className={styles.subtitle}>Fill in data and add questions</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* ── Metadata ─────────────────────────────────────────────── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Basics</h2>

          <div className={styles.formField}>
            <label className={styles.label} htmlFor="title">
              Name <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={styles.input}
              value={form.title}
              onChange={handleFormChange}
              placeholder="For example: Casinos and gambling"
              maxLength={100}
              required
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={styles.textarea}
              value={form.description}
              onChange={handleFormChange}
              placeholder="Brief description of the quiz (optional)"
              rows={2}
              maxLength={300}
            />
          </div>

          <div className={styles.formFieldRow}>
            <div className={styles.formField}>
              <label className={styles.label} htmlFor="difficulty">
                Complexity
              </label>
              <select
                id="difficulty"
                name="difficulty"
                className={styles.select}
                value={form.difficulty}
                onChange={handleFormChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className={styles.formField}>
              <label className={styles.label} htmlFor="defaultTimeLimit">
                Time for a question (sec)
              </label>
              <input
                id="defaultTimeLimit"
                name="defaultTimeLimit"
                type="number"
                className={styles.input}
                value={form.defaultTimeLimit}
                onChange={handleFormChange}
                min={5}
                max={120}
              />
            </div>
          </div>
        </section>

        {/* ── Questions ────────────────────────────────────────────── */}
        <section className={`${styles.section} ${styles.sectionGap}`}>
          <h2 className={styles.sectionTitle}>
            Questions
            {questions.length > 0 && (
              <span className={styles.questionCount}>{questions.length}</span>
            )}
          </h2>

          {/* Mode switcher */}
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

          {/* JSON mode */}
          {mode === 'json' && (
            <div className={styles.jsonImport}>
              <div className={styles.jsonToolbar}>
                <span className={styles.jsonHint}>
                  Paste the questions array in JSON format.{' '}
                  <code>answers[0]</code> — correct answer.
                </span>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSm}`}
                  onClick={handleLoadExample}
                >
                  Load example
                </button>
              </div>

              <textarea
                className={[
                  styles.jsonTextarea,
                  jsonError ? styles.jsonTextareaError : '',
                  jsonSuccess ? styles.jsonTextareaSuccess : '',
                ].join(' ')}
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
                <p className={styles.jsonError}>⚠ {jsonError}</p>
              )}

              {jsonSuccess && (
                <p className={styles.jsonSuccess}>
                  ✓ Uploaded {questions.length} question(s)
                </p>
              )}

              <div className={styles.jsonActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={handleParseJSON}
                  disabled={isParsing || jsonInput.trim() === ''}
                >
                  {isParsing ? 'Parsing...' : 'Import questions'}
                </button>

                {jsonInput && (
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={handleClearJSON}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Manual mode placeholder */}
          {mode === 'manual' && (
            <div className={styles.manualNotice}>
              <p>Manual addition of questions is in development.</p>
              <p>Use JSON import for quick populating.</p>
            </div>
          )}
        </section>

        {/* ── Question preview ────────────────────────────────────── */}
        {questions.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Question preview</h2>
            <ul className={styles.questionPreviewList}>
              {questions.map((q, i) => (
                <li key={q.id} className={styles.questionPreview}>
                  <div className={styles.questionPreviewHeader}>
                    <span className={styles.questionIndex}>#{i + 1}</span>
                    <span className={styles.questionText}>{q.text}</span>
                    <button
                      type="button"
                      className={styles.questionRemove}
                      onClick={() => handleRemoveQuestion(q.id)}
                      title="Remove question"
                    >
                      ✕
                    </button>
                  </div>
                  <ul className={styles.questionAnswers}>
                    {q.answers.map((a, ai) => (
                      <li
                        key={ai}
                        className={`${styles.questionAnswer} ${ai === 0 ? styles.questionAnswerCorrect : ''}`}
                      >
                        {ai === 0 && (
                          <span className={styles.questionCorrectMark}>✓</span>
                        )}
                        {a}
                      </li>
                    ))}
                  </ul>
                  {q.timeLimit && (
                    <span className={styles.questionTime}>⏱ {q.timeLimit}s</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Error and save button ───────────────────────────────── */}
        {submitError && (
          <p className={styles.submitError} style={{ marginTop: 16 }}>⚠ {submitError}</p>
        )}

        <div className={styles.footer} style={{ marginTop: 24 }}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => navigate('/app/quizzes')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLg}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create a quiz'}
          </button>
        </div>

      </form>
    </div>
  )
}
