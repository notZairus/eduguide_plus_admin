import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/auth/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Routes, Route, Navigate } from "react-router";
import HandbookIndex from "./pages/handbook/content/index";
import SectionEdit from "./pages/handbook/content/sections/edit";
import RegisterPage from "./pages/auth/RegisterPage";

import QuestionBank from "./pages/quiz/questions/page";
import QuizCreator from "./pages/quiz/QuizCreator";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route>
          <Route
            path="/login"
            element={
              <UnauthenticatedRoute>
                <LoginPage />
              </UnauthenticatedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <UnauthenticatedRoute>
                <RegisterPage />
              </UnauthenticatedRoute>
            }
          />
          <Route
            element={
              <AuthenticatedRoute>
                <MainLayout />
              </AuthenticatedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/handbook/contents" element={<HandbookIndex />} />

            <Route path="/quiz/create" element={<QuizCreator />} />
            <Route path="/questions" element={<QuestionBank />} />
          </Route>

          <Route path="/handbook/sections/:id" element={<SectionEdit />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
