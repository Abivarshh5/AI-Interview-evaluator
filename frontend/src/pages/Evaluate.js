import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Evaluate() {
  const [file, setFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setRoles(JSON.parse(localStorage.getItem("ai_roles") || "[]"));
    if (!selectedRoleId) {
      const first = JSON.parse(localStorage.getItem("ai_roles") || "[]")[0];
      if (first) setSelectedRoleId(first.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select audio or video file to upload.");
    if (!selectedRoleId) return alert("Select a role.");

    setLoading(true);
    const fd = new FormData();
    fd.append("audio", file);
    fd.append("roleId", selectedRoleId);
    fd.append("roleName", roles.find(r => r.id === selectedRoleId)?.title || "");

    try {
      const res = await api.post("/transcribe", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const data = res.data;

      // store report locally
      const reports = JSON.parse(localStorage.getItem("ai_reports") || "[]");
      const report = {
        id: Date.now().toString(),
        roleId: selectedRoleId,
        roleName: roles.find(r => r.id === selectedRoleId)?.title || "",
        transcript: data.transcript,
        summary: data.summary,
        evaluation: data.evaluation || { match: data.match ?? 0, comments: data.comments || [] },
        timestamp: Date.now(),
      };
      reports.push(report);
      localStorage.setItem("ai_reports", JSON.stringify(reports));

      // store last result and navigate to result page
      localStorage.setItem("ai_last_result", JSON.stringify(report));
      navigate("/result");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Interview (Audio / Video)</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <div className="text-sm text-slate-600 mb-1">Select Role</div>
          <select className="border p-2 w-full rounded" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
            <option value="">-- choose role --</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-slate-600 mb-1">Choose file (audio/video)</div>
          <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
          <div className="text-xs text-slate-400 mt-1">Supported: .mp3, .wav, .mp4, .mov</div>
        </label>

        <div className="flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded" disabled={loading}>
            {loading ? "Evaluating..." : "Upload & Evaluate"}
          </button>
        </div>
      </form>
    </div>
  );
}
