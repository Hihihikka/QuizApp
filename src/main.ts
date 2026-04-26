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
    correctAnswer: 'LAS VEGAS'
  },
  {
    text: 'Which card game is most commonly played in casinos?',
    answers: ['POKER', 'BRIDGE', 'UNO', 'PREFRANCE'],
    correctAnswer: 'POKER'
  },
  {
    text: 'Which symbol is most commonly found on slot machines?',
    answers: ['CHERRY', 'STAR', 'BELL', 'SEVEN'],
    correctAnswer: 'SEVEN'
  },
];

let score = 0

const questionText = document.querySelector<HTMLParagraphElement>('.question-card__text')!
const answersGrid = document.querySelector<HTMLDivElement>('.answers-grid')!
const scoreValue = document.querySelector<HTMLSpanElement>('.sidebar__card-value')!

function renderQuestion(question: Question): void {
  questionText.textContent = question.text
  answersGrid.innerHTML = ''

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
}

scoreValue.textContent = `✦ ${score}`
renderQuestion(questions[0])