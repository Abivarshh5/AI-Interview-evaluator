import React from "react";
import ResultCard from "../components/ResultCard";

export default function Result() {
  const report = JSON.parse(localStorage.getItem("ai_last_result") || "null");

  if (!report) {
    return <div className="text-center">No result available. Please evaluate a candidate.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-semibold">Evaluation Result</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Transcript</h3>
          <p className="text-sm text-slate-700 mt-2 whitespace-pre-line">{report.transcript}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Summary</h3>
          <p className="text-sm text-slate-700 mt-2">{report.summary}</p>
        </div>
      </div>

      <ResultCard evaluation={report.evaluation} />
    </div>
  );
}
