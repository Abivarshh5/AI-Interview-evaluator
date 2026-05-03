import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  LogOut,
  User,
  FileAudio,
  FileText,
  BarChart3,
} from "lucide-react";
import axios from "axios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "user@example.com"
  );

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/reports")
      .then((res) => setReports(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 230 : 70 }}
        className="bg-indigo-700/90 backdrop-blur-md text-white flex flex-col p-3 transition-all duration-300 shadow-2xl rounded-tr-3xl rounded-br-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`font-bold text-lg tracking-wide ${
              sidebarOpen ? "block" : "hidden"
            }`}
          >
            AI Eval
          </h1>
          <Menu
            size={24}
            className="cursor-pointer hover:text-indigo-200 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav className="space-y-4">
          <SidebarItem icon={<User />} label="Profile" open={sidebarOpen} />
          <SidebarItem icon={<FileAudio />} label="Transcripts" open={sidebarOpen} />
          <SidebarItem icon={<FileText />} label="Summaries" open={sidebarOpen} />
          <SidebarItem icon={<BarChart3 />} label="Reports" open={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-4 border-t border-indigo-500/50">
          <button
            onClick={logout}
            className="flex items-center text-sm gap-2 text-red-300 hover:text-red-100 transition"
          >
            <LogOut size={18} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white/60 backdrop-blur-lg p-4 shadow-sm sticky top-0 z-10 border-b border-gray-200 rounded-b-3xl">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex flex-col text-right">
            <p className="text-sm font-medium text-gray-800">{userEmail}</p>
            <p className="text-xs text-gray-500">Logged in</p>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-8 space-y-10">
          {/* Summary cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <StatCard title="Total Reports" value={reports.length} color="from-indigo-400 to-indigo-600" />
            <StatCard title="Active Roles" value="5" color="from-purple-400 to-purple-600" />
            <StatCard title="Evaluations" value="12" color="from-pink-400 to-pink-600" />
            <StatCard title="Users" value="3" color="from-blue-400 to-blue-600" />
          </motion.div>

          {/* Reports section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Recent Reports
            </h3>
            {reports.length === 0 ? (
              <p className="text-gray-500 text-sm italic">
                No reports found yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.slice(0, 6).map((r) => (
                  <motion.div
                    key={r.id}
                    whileHover={{ scale: 1.03, y: -3 }}
                    className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md p-5 border border-gray-200 hover:border-indigo-400 transition-all"
                  >
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {r.roleName || "Untitled Role"}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {r.summary}
                    </p>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{new Date(r.timestamp).toLocaleDateString()}</span>
                      <span className="text-indigo-600 font-medium">
                        Match: {r.evaluation?.overallMatch || "0"}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, open }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255,255,255,0.15)",
      }}
      className="flex items-center gap-3 cursor-pointer text-sm font-medium p-2 rounded-md hover:bg-indigo-600 transition"
    >
      {icon}
      {open && <span>{label}</span>}
    </motion.div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-xl shadow-sm border border-gray-100 p-4 bg-gradient-to-br ${color} text-white backdrop-blur-md`}
    >
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
    </motion.div>
  );
}
