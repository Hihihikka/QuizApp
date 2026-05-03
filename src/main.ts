import './style.css'

interface Question {
  text: string
  answers: string[]
  correctAnswer: string
}

const questions: Question[] = [
  {
    text: 'In which city is the famous Bellagio casino located?',
    answers: ['LAS VEGAS', 'MONACO', 'MACAU', 'LONDON'],
    correctAnswer: 'LAS VEGAS',
  },
  {
    text: 'Which card game is most commonly played in casinos?',
    answers: ['POKER', 'BRIDGE', 'UNO', 'PREFRANCE'],
    correctAnswer: 'POKER',
  },
  {
    text: 'Which symbol is most commonly found on slot machines?',
    answers: ['CHERRY', 'STAR', 'BELL', 'SEVEN'],
    correctAnswer: 'SEVEN',
  },
]

let score = 0
let currentIndex = 0

const questionText = document.querySelector<HTMLParagraphElement>('.question-card__text')!
const answersGrid = document.querySelector<HTMLDivElement>('.answers-grid')!
const scoreValue = document.querySelector<HTMLSpanElement>('.sidebar__card-value')!
const nextBtn = document.querySelector<HTMLButtonElement>('.next-btn')!
const finalScreen = document.querySelector<HTMLDivElement>('.final-screen')!
const finalScore = document.querySelector<HTMLSpanElement>('.final-screen__score')!
const restartBtn = document.querySelector<HTMLButtonElement>('.restart-btn')!
const progressLabel = document.querySelector<HTMLSpanElement>('.progress__label')!
const questionCard = document.querySelector<HTMLDivElement>('.question-card')!

function renderQuestion(question: Question): void {
  questionText.textContent = question.text
  answersGrid.innerHTML = ''
  nextBtn.classList.add('hidden')

  progressLabel.textContent = `QUESTION ${currentIndex + 1} OF ${questions.length}`

  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.className = 'answer-btn'
    button.textContent = answer
    button.addEventListener('click', () => checkAnswer(button, answer, question.correctAnswer))
    answersGrid.appendChild(button)
  })
}

function checkAnswer(button: HTMLButtonElement, answer: string, correctAnswer: string): void {
  document.querySelectorAll<HTMLButtonElement>('.answer-btn').forEach(btn => {
    btn.disabled = true
    if (btn.textContent === correctAnswer) {
      btn.classList.add('answer-btn--correct')
    }
  })

  if (answer === correctAnswer) {
    score += 100
    scoreValue.textContent = `✦ ${score}`
  } else {
    button.classList.add('answer-btn--wrong')
  }

  nextBtn.classList.remove('hidden')
}

function showFinalScreen(): void {
  questionCard.classList.add('hidden')
  answersGrid.classList.add('hidden')
  nextBtn.classList.add('hidden')
  finalScreen.classList.remove('hidden')
  finalScore.textContent = `✦ ${score}`
}

function restartQuiz(): void {
  score = 0
  currentIndex = 0
  scoreValue.textContent = `✦ ${score}`
  questionCard.classList.remove('hidden')
  answersGrid.classList.remove('hidden')
  finalScreen.classList.add('hidden')
  renderQuestion(questions[currentIndex])
}

nextBtn.addEventListener('click', () => {
  currentIndex++
  if (currentIndex < questions.length) {
    renderQuestion(questions[currentIndex])
  } else {
    showFinalScreen()
  }
})

restartBtn.addEventListener('click', restartQuiz)

scoreValue.textContent = `✦ ${score}`
renderQuestion(questions[currentIndex])