import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/auth/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Routes, Route, Navigate } from "react-router";

import HandbookIndex from "./pages/handbook/content/index";
import HandbookConfigure from "./pages/handbook/configure/page";

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

        <Route element={<UnauthenticatedRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<AuthenticatedRoute />}>
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <Dashboard />
              </MainLayout>
            }
          />

          <Route
            path="/handbook/contents"
            element={
              <MainLayout>
                <HandbookIndex />
              </MainLayout>
            }
          />
          <Route
            path="/handbook/configure"
            element={
              <MainLayout>
                <HandbookConfigure />
              </MainLayout>
            }
          />

          <Route
            path="/quiz/create"
            element={
              <MainLayout>
                <QuizCreator />
              </MainLayout>
            }
          />

          <Route
            path="/questions"
            element={
              <MainLayout>
                <QuestionBank />
              </MainLayout>
            }
          />

          <Route path="/handbook/sections/:id" element={<SectionEdit />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
