import type { ChangeEvent } from 'react'
import type { QuizDifficulty } from '../types'
import { TIME_LIMIT_MIN, TIME_LIMIT_MAX } from '@quizapp/shared'
import styles from './QuizMetaFields.module.css'

export interface QuizMetaValues {
  title: string
  description: string
  difficulty: QuizDifficulty
  defaultTimeLimit: number
}

interface QuizMetaFieldsProps {
  values: QuizMetaValues
  onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
}

export default function QuizMetaFields({ values, onChange }: QuizMetaFieldsProps) {
  return (
      <>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="title">
            Name <span className={styles.required}>*</span>
          </label>
          <input
              id="title"
              name="title"
              type="text"
              className={styles.input}
              value={values.title}
              onChange={onChange}
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
              value={values.description}
              onChange={onChange}
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
                value={values.difficulty}
                onChange={onChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className={styles.formField}>
            <label className={styles.label} htmlFor="defaultTimeLimit">
              Time per question (sec)
            </label>
            <input
                id="defaultTimeLimit"
                name="defaultTimeLimit"
                type="number"
                className={styles.input}
                value={values.defaultTimeLimit}
                onChange={onChange}
                min={TIME_LIMIT_MIN}
                max={TIME_LIMIT_MAX}
            />
          </div>
        </div>
      </>
  )
}