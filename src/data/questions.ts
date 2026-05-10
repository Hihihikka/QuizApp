export interface Question {
  text: string
  answers: string[]
  correctAnswer: string
}

export const questions: Question[] = [
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