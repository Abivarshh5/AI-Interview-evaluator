import React, { useEffect, useState } from "react";
import API from "../api";

export default function Evaluations(){
  const [reports, setReports] = useState([]);

  useEffect(()=>{
    API.get("/reports").then(r=>setReports((r.data||[]).slice().reverse())).catch(()=>setReports(JSON.parse(localStorage.getItem("ai_reports")||"[]").slice().reverse()));
  },[]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Evaluations</h2>
      {reports.length === 0 ? <div className="text-slate-500">No evaluations yet</div> : (
        reports.map(r => (
          <div key={r.id} className="bg-white p-4 rounded shadow-soft mb-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{r.roleName || "—"}</div>
                <div className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{r.evaluation?.match ?? r.evaluation?.match_percent ?? 0}%</div>
                <div className="text-xs text-slate-500">match</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="font-medium">Summary</div>
              <div className="text-sm text-slate-700 mt-1">{r.summary}</div>
            </div>

            <div className="mt-3">
              <div className="font-medium">Comments</div>
              <ul className="list-disc ml-5 text-sm text-slate-700 mt-1">
                {(r.evaluation?.comments || []).map((c,i)=>(<li key={i}>{c}</li>))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
