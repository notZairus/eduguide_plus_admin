import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
// import AuthenticatedRoute from "./components/AuthenticatedRoute";
import { Routes, Route } from "react-router";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

const App = () => {
  return (
    <>
      {/* PUBLIC ROUTES */}
      <Routes>
        <Route path="/" element={<p>Hello world</p>} />
      </Routes>

      {/* UNAUTHENTICATED ROUTES */}
      <Routes>
        <Route>
          <Route
            path="/login"
            element={
              <UnauthenticatedRoute>
                <LoginPage />
              </UnauthenticatedRoute>
            }
          />
        </Route>
      </Routes>

      {/* AUTHENTICATED ROUTES */}
      <Routes>
        <Route
          element={
            <AuthenticatedRoute>
              <DashboardLayout />
            </AuthenticatedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
