import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { Routes, Route } from "react-router";
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
import HandbookIndex from "./pages/handbook/index";
import HandbookShow from "./pages/handbook/show";

const App = () => {
  return (
    <>
      {/* PUBLIC ROUTES */}
      <Routes>
        <Route path="/" element={<p>Hello world</p>} />
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
            <Route path="/handbook/:id" element={<HandbookShow />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
