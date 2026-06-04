import { createBrowserRouter } from 'react-router-dom'
import { SidebarProvider } from '../providers/SidebarProvider'
import RootLayout from '../layouts/RootLayout'
import ProtectedRoute from './ProtectedRoute'
import PlayPage from '../pages/game/PlayPage'
import CreateQuiz from '../pages/app/CreateQuiz'
import Quizzes from '../pages/app/Quizzes'

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
        ],
      },
    ],
  },
])