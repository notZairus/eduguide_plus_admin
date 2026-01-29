import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import { Routes, Route, Navigate } from "react-router";
import HandbookIndex from "./pages/handbook/index";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import SectionEdit from "./pages/handbook/sections/edit";

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

          <Route path="/handbook/sections/:id" element={<SectionEdit />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
