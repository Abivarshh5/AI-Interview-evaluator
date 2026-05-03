import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Upload(){
  const [roles, setRoles] = useState([]);
  const [file, setFile] = useState(null);
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{ API.get("/roles").then(r=>setRoles(r.data)).catch(()=>setRoles([])); },[]);

  useEffect(()=>{ if(!roleId && roles.length) setRoleId(roles[0].id); }, [roles]);

  const submit = async e => {
    e.preventDefault();
    if(!file) return alert("Choose audio/video file");
    setLoading(true);
    const fd = new FormData();
    fd.append("audio", file);
    fd.append("roleId", roleId);
    fd.append("roleName", roles.find(r=>r.id===roleId)?.title || "");
    try {
      const res = await API.post("/transcribe", fd, { headers: { "Content-Type": "multipart/form-data" }, timeout: 2*60*1000 });
      // store locally for quick preview
      const reports = JSON.parse(localStorage.getItem("ai_reports")||"[]");
      reports.push({ id: Date.now().toString(), transcript: res.data.transcript, summary: res.data.summary, evaluation: res.data.evaluation, timestamp: Date.now(), roleName: roles.find(r=>r.id===roleId)?.title });
      localStorage.setItem("ai_reports", JSON.stringify(reports));
      navigate("/evaluations");
    } catch(err){
      console.error(err);
      alert("Upload failed. Check backend logs.");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Upload Interview</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow-soft space-y-4">
        <label className="block">
          <div className="text-sm text-slate-600 mb-1">Select Role</div>
          <select value={roleId} onChange={e=>setRoleId(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- select role --</option>
            {roles.map(r=> <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-slate-600 mb-1">Audio / Video file</div>
          <input type="file" accept="audio/*,video/*" onChange={e=>setFile(e.target.files[0])}/>
          <div className="text-xs text-slate-400 mt-1">Supported: mp3, wav, m4a, mp4, mov</div>
        </label>

        <div className="flex items-center gap-3">
          <button disabled={loading} className="bg-accent text-white py-2 px-4 rounded">{loading ? "Processing..." : "Upload & Evaluate"}</button>
          <button type="button" onClick={()=>setFile(null)} className="px-4 py-2 border rounded">Reset</button>
        </div>
      </form>
    </div>
  );
}
