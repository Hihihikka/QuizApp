interface Props {
  onClick: () => void
}

export default function NextButton({ onClick }: Props) {
  return (
    <button className="next-btn" onClick={onClick}>
      NEXT QUESTION →
    </button>
  )
}