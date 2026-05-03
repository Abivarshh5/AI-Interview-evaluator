import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaChartBar, FaUserTie, FaUpload, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-2 rounded-md transition ${isActive ? "bg-accent text-white" : "text-slate-700 hover:bg-slate-100"}`;

  return (
    <aside className="w-64 bg-white shadow-lg p-5 hidden md:flex flex-col justify-between">
      <div>
        <div className="mb-6">
          <div className="text-2xl font-bold text-brand">Hirelytics</div>
          <div className="text-xs text-slate-400">AI Interview Evaluator</div>
        </div>

        <nav className="space-y-1">
          <NavLink to="/" className={linkClass}><FaChartBar/> Dashboard</NavLink>
          <NavLink to="/roles" className={linkClass}><FaUserTie/> Roles</NavLink>
          <NavLink to="/upload" className={linkClass}><FaUpload/> Upload</NavLink>
          <NavLink to="/evaluations" className={linkClass}><FaClipboardList/> Evaluations</NavLink>
        </nav>
      </div>

      <div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
