import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Roles from "./pages/Roles";
import Upload from "./pages/Upload";
import Evaluations from "./pages/Evaluations";

function Protected({ children }) {
  const authed = localStorage.getItem("auth") === "true";
  return authed ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Protected><Dashboard /></Protected>} />
              <Route path="/roles" element={<Protected><Roles /></Protected>} />
              <Route path="/upload" element={<Protected><Upload /></Protected>} />
              <Route path="/evaluations" element={<Protected><Evaluations /></Protected>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
