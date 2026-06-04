import s from './NextButton.module.css'

interface Props {
  onClick: () => void
}

export default function NextButton({ onClick }: Props) {
  return (
    <button className={s.btn} onClick={onClick}>
      NEXT QUESTION →
    </button>
  )
}