import './style.css'

interface Question {
  text: string
  answers: string[]
}

const questions: Question[] = [
  {
    text: 'In which city is the famous Bellagio casino located?',
    answers: ['LAS VEGAS', 'MONACO', 'MACAU', 'LONDON'],
  },
  {
    text: 'Which card game is most commonly played in casinos?',
    answers: ['POKER', 'BRIDGE', 'UNO', 'PREFRANCE'],
  },
  {
    text: 'Which symbol is most commonly found on slot machines?',
    answers: ['CHERRY', 'STAR', 'BELL', 'SEVEN'],
  },
];

const questionText = document.querySelector<HTMLParagraphElement>('.question-card__text')!
const answersGrid = document.querySelector<HTMLDivElement>('.answers-grid')!

function renderQuestion(question: Question): void {
  questionText.textContent = question.text
  answersGrid.innerHTML = ''

  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.className = 'answer-btn'
    button.textContent = answer
    button.addEventListener('click', () => {
      document.querySelectorAll('.answer-btn').forEach(btn => btn.classList.remove('answer-btn--selected'))
      button.classList.add('answer-btn--selected')
    })
    answersGrid.appendChild(button)
  })
}

renderQuestion(questions[0])