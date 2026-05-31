import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddChild from "./pages/AddChild";
import AddReport from "./pages/AddReport";
import Attendance from "./pages/Attendance";
import AdminDashboard from "./pages/AdminDashboard";
import ChildProfile from "./pages/ChildProfile";
import ClassManagement from "./pages/ClassManagement";
import ReportsPage from "./pages/ReportsPage";
import AllAttendancePage from "./pages/AllAttendancePage";
import Login from "./pages/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authenticated") === "true"
  );

  useEffect(() => {
    localStorage.setItem("authenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/add-child" element={<ProtectedRoute element={<AddChild />} />} />
        <Route path="/add-report" element={<ProtectedRoute element={<AddReport />} />} />
        <Route path="/reports" element={<ProtectedRoute element={<ReportsPage />} />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} />} />
        <Route path="/all-attendance" element={<ProtectedRoute element={<AllAttendancePage />} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/classes" element={<ProtectedRoute element={<ClassManagement />} />} />
        <Route path="/child/:id" element={<ProtectedRoute element={<ChildProfile />} />} />
      </Routes>
    </Router>
  );
}

export default App;