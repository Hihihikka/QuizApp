import { createBrowserRouter } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout'
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'

import PlayPage from '../pages/game/PlayPage'
import CreateQuiz from '../pages/app/CreateQuiz'
import Quizzes from '../pages/app/Quizzes'
// import Dashboard from '../pages/app/Dashboard'
// import LoginPage from '../pages/auth/LoginPage'
// import RegisterPage from '../pages/auth/RegisterPage'
// import JoinPage from '../pages/JoinPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      // Публичные игровые маршруты
      { path: '/', element: <Quizzes /> },              // временный root
      { path: '/play', element: <PlayPage /> },          // demo/fallback квиз
      { path: '/play/:quizId', element: <PlayPage /> },  // квиз по id

      // { path: '/join', element: <JoinPage /> },
      // { path: '/login', element: <LoginPage /> },
      // { path: '/register', element: <RegisterPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          // { path: 'dashboard', element: <Dashboard /> },
          { path: 'quizzes', element: <Quizzes /> },
          { path: 'quizzes/create', element: <CreateQuiz /> },
          // { path: 'quizzes/:id/edit', element: <EditQuiz /> },
        ],
      },
    ],
  },
])