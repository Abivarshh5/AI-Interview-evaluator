import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <aside className={`bg-white border-r w-64 p-4 hidden md:block`}>
      <div className="mb-6">
        <div className="text-lg font-bold">HR Dashboard</div>
        <div className="text-xs text-slate-500">Interview Evaluator</div>
      </div>

      <nav className="space-y-2">
        <Link to="/dashboard" className="block p-2 rounded hover:bg-slate-50">Dashboard</Link>
        <Link to="/role" className="block p-2 rounded hover:bg-slate-50">Create Role</Link>
        <Link to="/evaluate" className="block p-2 rounded hover:bg-slate-50">Evaluate Candidate</Link>
        <Link to="/reports" className="block p-2 rounded hover:bg-slate-50">Reports</Link>
      </nav>
    </aside>
  );
}
