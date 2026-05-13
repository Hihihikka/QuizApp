export interface Question {
  text: string
  answers: string[]
}

export const questions: Question[] = [
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
    answers: ['SEVEN', 'CHERRY', 'STAR', 'BELL'],
  },
]