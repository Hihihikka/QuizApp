import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import PlayPage from "../pages/game/PlayPage";
// import JoinPage from "../pages/JoinPage";

// import LoginPage from "../pages/auth/LoginPage.tsx";
// import RegisterPage from "../pages/auth/RegisterPage";

// import Dashboard from "../pages/app/Dashboard";
// import Quizzes from "../pages/app/Quizzes";
// import CreateQuiz from "../pages/app/CreateQuiz";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
    //   { path: "/", element: <JoinPage /> },
    //   { path: "/join", element: <JoinPage /> },
    //   { path: "/play/:sessionCode", element: <PlayPage /> },
      { path: "/play", element: <PlayPage /> },
    //   { path: "/login", element: <LoginPage /> },
    //   { path: "/register", element: <RegisterPage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/app",
        element: <AppLayout />,
        children: [
        //   { path: "dashboard", element: <Dashboard /> },
        //   { path: "quizzes", element: <Quizzes /> },
        //   { path: "quizzes/create", element: <CreateQuiz /> },
        ],
      },
    ],
  },
]);