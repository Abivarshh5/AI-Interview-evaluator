import React from "react";

export default function ResultCard({ evaluation }) {
  // evaluation can be { match, comments, scores: {communication:85,...} }
  const scores = evaluation.scores || {};
  const hasScores = Object.keys(scores).length > 0;

  return (
    <div className="bg-white shadow rounded p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Evaluation Summary</h3>
          <p className="text-sm text-slate-500">Overall match: <span className="font-bold">{evaluation.match ?? "N/A"}%</span></p>
        </div>
      </div>

      {hasScores ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(scores).map(([k, v]) => (
            <div key={k} className="p-3 border rounded">
              <div className="text-sm text-slate-600 capitalize">{k}</div>
              <div className="text-2xl font-bold">{v}%</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3 border rounded text-slate-600">
          Detailed category scores not available. Showing overall match.
        </div>
      )}

      <div>
        <h4 className="font-semibold">Comments & Suggestions</h4>
        <ul className="list-disc ml-5 mt-2 text-sm text-slate-700">
          {evaluation.comments && evaluation.comments.length ? (
            evaluation.comments.map((c, i) => <li key={i}>{c}</li>)
          ) : (
            <li>No comments available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
