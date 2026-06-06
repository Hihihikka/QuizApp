import type { ReactNode } from 'react'
import styles from './QuizFormSection.module.css'

interface QuizFormSectionProps {
  title: string
  badge?: ReactNode
  children: ReactNode
}

export default function QuizFormSection({
  title,
  badge,
  children,
}: QuizFormSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        {title}
        {badge !== undefined && (
          <span className={styles.badge}>{badge}</span>
        )}
      </h2>
      {children}
    </section>
  )
}
