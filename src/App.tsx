import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { Routes, Route, Navigate } from "react-router";
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
import HandbookIndex from "./pages/handbook/index";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import Tiptap from "./components/SimpleEditor";

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
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/handbook" element={<HandbookIndex />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
