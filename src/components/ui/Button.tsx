import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'default' | 'primary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'default',
  size = 'md',
  full = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.btn,
    variant !== 'default' ? styles[variant] : '',
    size !== 'md' ? styles[size] : '',
    full ? styles.full : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}
