import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("ai_user");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          className="p-2 rounded-md hover:bg-slate-100"
        >
          ☰
        </button>
        <div className="text-xl font-semibold text-slate-800">AI Interview Evaluator</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 hidden md:block">Recruiter</div>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
