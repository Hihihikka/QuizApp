import { useState } from 'react'
import { parseQuestionsJSON, EXAMPLE_QUESTIONS_JSON } from '../quizParser'
import type { Question } from '../types'
import Button from '../../../components/ui/Button'
import styles from './JsonImportSection.module.css'

interface JsonImportSectionProps {
  hint?: string
  rows?: number
  onImport: (questions: Question[]) => void
}

export default function JsonImportSection({
  hint = 'Paste the questions array in JSON format. answers[0] — correct answer.',
  rows = 12,
  onImport,
}: JsonImportSectionProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  async function handleParse() {
    setError(null)
    setSuccess(false)
    setIsParsing(true)
    try {
      const result = await parseQuestionsJSON(value)
      if (!result.success) {
        setError(result.error)
        return
      }
      onImport(result.questions)
      setSuccess(true)
      setValue('')
    } finally {
      setIsParsing(false)
    }
  }

  function handleLoadExample() {
    setValue(EXAMPLE_QUESTIONS_JSON)
    setError(null)
    setSuccess(false)
  }

  function handleClear() {
    setValue('')
    setError(null)
    setSuccess(false)
  }

  const textareaClass = [
    styles.textarea,
    error ? styles.textareaError : '',
    success ? styles.textareaSuccess : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.hint}>{hint}</span>
        <Button size="sm" onClick={handleLoadExample} type="button">
          Load example
        </Button>
      </div>

      <textarea
        className={textareaClass}
        value={value}
        onChange={e => {
          setValue(e.target.value)
          setError(null)
          setSuccess(false)
        }}
        placeholder={`[\n  {\n    "text": "Question?",\n    "answers": ["CORRECT", "WRONG 1", "WRONG 2"],\n    "timeLimit": 15\n  }\n]`}
        rows={rows}
        spellCheck={false}
      />

      {error && <p className={styles.error}>⚠ {error}</p>}
      {success && <p className={styles.success}>✓ Questions imported</p>}

      <div className={styles.actions}>
        <Button
          variant="primary"
          type="button"
          onClick={handleParse}
          disabled={isParsing || value.trim() === ''}
        >
          {isParsing ? 'Parsing...' : 'Import questions'}
        </Button>

        {value && (
          <Button type="button" onClick={handleClear}>
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
