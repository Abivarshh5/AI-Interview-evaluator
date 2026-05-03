import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-white border" aria-label="menu">☰</button>
        <h1 className="text-lg font-semibold">AI Interview Evaluator</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">HR Admin</div>
        <img src="https://i.pravatar.cc/40" alt="avatar" className="rounded-full" />
      </div>
    </header>
  );
}
