import { useEffect, useState } from "react";
import { getHistory, deleteScan } from "../services/api";

function scoreColor(s) {
  if (s === 0)  return "var(--safe)";
  if (s <= 30)  return "var(--warn)";
  return "var(--danger)";
}

export default function HistoryPanel({ onSelect }) {
  const [rows, setRows]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const load = () => {
    setLoading(true);
    getHistory()
      .then((r) => setRows(r.data))
      .catch(() => setError("Could not load history — is the backend running on port 8080?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // don't trigger row click
    if (!window.confirm("Delete this scan?")) return;
    try {
      await deleteScan(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  if (loading) return (
    <div className="panel-body">
      <div className="scanning-wrap">
        <div className="scan-ring" />
        <div className="scan-phase">LOADING HISTORY...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="panel-body"><div className="err">{error}</div></div>
  );

  if (!rows.length) return (
    <div className="panel-body">
      <div className="no-history">NO SCAN HISTORY YET</div>
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>File / URL</th>         {/* fileName */}
            <th>Type</th>               {/* scanType */}
            <th>Score</th>              {/* riskScore */}
            <th>Status</th>             {/* status */}
            <th>Severity</th>           {/* severity */}
            <th>Date</th>               {/* timestamp */}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} onClick={() => onSelect(r)} title="Click to view report">
              <td style={{
                fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text3)"
              }}>
                {r.id}
              </td>

              {/* fileName — your actual field name */}
              <td className="input-cell" title={r.fileName}>{r.fileName}</td>

              {/* scanType — "File scan" or "URL scan" */}
              <td><span className="type-pill">{r.scanType}</span></td>

              {/* riskScore */}
              <td className="score-cell" style={{ color: scoreColor(r.riskScore) }}>
                {r.riskScore}
              </td>

              {/* status — "Safe" / "Suspicious" / "Dangerous" */}
              <td>
                <span className={`status-badge ${
                  r.status === "Safe"       ? "SAFE" :
                  r.status === "Suspicious" ? "SUSPICIOUS" : "DANGEROUS"
                }`} style={{ fontSize: "0.62rem", padding: "3px 10px" }}>
                  <span className="badge-dot" />
                  {r.status?.toUpperCase()}
                </span>
              </td>

              {/* severity */}
              <td><span className={`sev ${r.severity}`}>{r.severity}</span></td>

              {/* timestamp */}
              <td className="ts-cell">
                {r.timestamp ? new Date(r.timestamp).toLocaleString() : "—"}
              </td>

              {/* delete button */}
              <td>
                <button
                  onClick={(e) => handleDelete(e, r.id)}
                  style={{
                    background: "none",
                    border: "1px solid rgba(255,61,61,0.3)",
                    color: "var(--danger)",
                    fontFamily: "var(--mono)",
                    fontSize: "0.65rem",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    letterSpacing: "1px",
                  }}
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        padding: "12px 16px", borderTop: "1px solid var(--border)",
        fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text3)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span>{rows.length} scan{rows.length !== 1 ? "s" : ""} in history</span>
        <button onClick={load} style={{
          background: "none", border: "1px solid var(--border2)",
          color: "var(--text3)", fontFamily: "var(--mono)", fontSize: "0.68rem",
          padding: "4px 12px", borderRadius: "4px", cursor: "pointer", letterSpacing: "1px"
        }}>
          ↺ REFRESH
        </button>
      </div>
    </div>
  );
}
