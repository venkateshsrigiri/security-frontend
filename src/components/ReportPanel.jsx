import RiskMeter from "./RiskMeter";
import FindingsTable from "./FindingsTable";

function StatusBadge({ status }) {
  const map = {
    Safe:       { cls: "SAFE",       icon: "✓" },
    Suspicious: { cls: "SUSPICIOUS", icon: "⚠" },
    Dangerous:  { cls: "DANGEROUS",  icon: "✕" },
  };
  const cfg = map[status] || { cls: "SAFE", icon: "?" };
  return (
    <span className={`status-badge ${cfg.cls}`}>
      <span className="badge-dot" />
      {cfg.icon} {status?.toUpperCase()}
    </span>
  );
}

function SeverityBadge({ severity }) {
  return <span className={`sev ${severity}`}>{severity}</span>;
}

export default function ReportPanel({ report }) {
  if (!report) return null;

  const {
    id,
    fileName,
    scanType,
    riskScore,
    status,
    severity,
    findings,
    timestamp,
  } = report;

  const findingsList = findings
    ? findings.split(/,\s*(?=[A-Z])/).map((f) => f.trim()).filter(Boolean)
    : [];

  const scoreColor =
    riskScore === 0  ? "var(--safe)" :
    riskScore <= 30  ? "var(--warn)" : "var(--danger)";

  return (
    <div className="report-wrap fade-up">

      {/* ── Overview card ── */}
      <div className="ov-card">

        <div className="ov-top">
          <div>
            <div className="ov-name" title={fileName}>{fileName}</div>
            <div className="ov-meta">
              <span style={{ color: "var(--accent)" }}>{scanType}</span>
              <span>·</span>
              <span>{timestamp ? new Date(timestamp).toLocaleString() : "—"}</span>
              <span>·</span>
              <span>ID #{id}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <StatusBadge status={status} />
            <SeverityBadge severity={severity} />
          </div>
        </div>

        <RiskMeter score={riskScore ?? 0} />

        <div className="stats-row">
          <div className="stat-cell">
            <div className="stat-val" style={{ color: "var(--text)" }}>
              {findingsList.length}
            </div>
            <div className="stat-lbl">Findings</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val" style={{ color: scoreColor }}>{riskScore}</div>
            <div className="stat-lbl">Risk Score</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val" style={{ color: scoreColor, fontSize: "1rem", paddingTop: 8 }}>
              {severity}
            </div>
            <div className="stat-lbl">Severity</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val" style={{ color: scoreColor, fontSize: "1rem", paddingTop: 8 }}>
              {status?.toUpperCase()}
            </div>
            <div className="stat-lbl">Status</div>
          </div>
        </div>
      </div>

      {/* ── Findings ── */}
      <div className="findings-panel">
        <div className="panel-header">
          ◈ Findings
          <span style={{ marginLeft: "auto", color: "var(--text3)" }}>
            {findingsList.length} issue{findingsList.length !== 1 ? "s" : ""}
          </span>
        </div>
        <FindingsTable findings={findings} />
      </div>

      {/* ── Raw output ── */}
      {findings && (
        <div style={{
          background: "var(--bg2)", border: "1px solid var(--border)",
          borderRadius: 10, overflow: "hidden"
        }}>
          <div className="panel-header">◈ Raw Findings Output</div>
          <div style={{
            padding: "14px 20px", fontFamily: "var(--mono)",
            fontSize: "0.78rem", color: "var(--warn)",
            lineHeight: 1.8, wordBreak: "break-word"
          }}>
            {findings}
          </div>
        </div>
      )}

    </div>
  );
}