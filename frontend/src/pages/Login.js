import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("recruiter@example.com");
  const [password, setPassword] = useState("password");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { email, password });
      alert("Registered. You can login now.");
    } catch (err) {
      alert("Register error: " + (err?.response?.data?.message || err.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/login", { email, password });
      localStorage.setItem("ai_user", email);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign in to AI Interview Evaluator</h2>
        <form className="space-y-3" onSubmit={handleLogin}>
          <input
            className="border p-2 rounded w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex gap-2">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
              Login
            </button>
            <button onClick={handleRegister} className="bg-white border px-4 py-2 rounded">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
