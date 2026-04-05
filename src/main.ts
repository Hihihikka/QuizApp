import './style.css'

interface Question {
  text: string
  answers: string[]
}

const question: Question = {
  text: 'In which city is the famous Bellagio casino located?',
  answers: ['LAS VEGAS', 'MONACO', 'MACAU', 'LONDON'],
}

const questionText = document.querySelector<HTMLParagraphElement>('.question-card__text')!
const answersGrid = document.querySelector<HTMLDivElement>('.answers-grid')!

questionText.textContent = question.text

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