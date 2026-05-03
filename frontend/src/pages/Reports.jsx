import React, { useEffect, useState } from "react";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(JSON.parse(localStorage.getItem("ai_reports") || "[]").reverse());
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Reports</h2>

      {reports.length === 0 ? (
        <div className="text-slate-500">No saved reports yet.</div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{r.roleName}</div>
                  <div className="text-xs text-slate-500">{new Date(r.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{r.evaluation.match}%</div>
                  <div className="text-xs text-slate-500">Overall match</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-700">{r.summary}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
