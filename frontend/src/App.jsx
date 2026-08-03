import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login.jsx";
import { Nickname } from "./pages/Nickname.jsx";
import { Home } from "./pages/Home.jsx";
import { CheckIn } from "./pages/CheckIn.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/nickname"
        element={
          <ProtectedRoute>
            <Nickname />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <CheckIn />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
