import { createBrowserRouter } from 'react-router-dom'
import { SidebarProvider } from '../providers/SidebarProvider'
import RootLayout from '../layouts/RootLayout'
import ProtectedRoute from './ProtectedRoute'
import PlayPage from '../features/gameplay/pages/PlayPage'
import CreateQuiz from '../features/quiz/pages/CreateQuiz'
import EditQuiz from '../features/quiz/pages/EditQuiz'
import PreviewQuiz from '../features/quiz/pages/PreviewQuiz'
import Quizzes from '../features/quiz/pages/Quizzes'

export const router = createBrowserRouter([
  {
    element: (
      <SidebarProvider>
        <RootLayout />
      </SidebarProvider>
    ),
    children: [
      { path: '/', element: <Quizzes /> },
      { path: '/play', element: <PlayPage /> },
      { path: '/play/:quizId', element: <PlayPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/app/quizzes', element: <Quizzes /> },
          { path: '/app/quizzes/create', element: <CreateQuiz /> },
          { path: '/app/quizzes/:quizId/preview', element: <PreviewQuiz /> },
          { path: '/app/quizzes/:quizId/edit', element: <EditQuiz /> },
        ],
      },
    ],
  },
])