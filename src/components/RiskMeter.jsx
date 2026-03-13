// Thresholds match your RiskScoreService.java:
// score == 0  → Safe
// score <= 30 → Suspicious
// score >  30 → Dangerous

export default function RiskMeter({ score }) {
  const color =
    score === 0  ? "var(--safe)" :
    score <= 30  ? "var(--warn)" : "var(--danger)";

  // Cap visual bar at 100 but scores can technically exceed it
  const barWidth = Math.min(score, 100);

  return (
    <div className="risk-section">
      <div className="risk-row">
        <span className="risk-lbl">RISK SCORE</span>
        <span className="risk-num" style={{ color }}>
          {score}
          <span className="risk-denom">/100</span>
        </span>
      </div>
      <div className="risk-track">
        <div
          className="risk-fill"
          style={{ width: `${barWidth}%`, background: color }}
        />
      </div>
      <div className="risk-labels">
        <span style={{ color: "var(--safe)" }}>0 — SAFE</span>
        <span style={{ color: "var(--warn)" }}>1–30 — SUSPICIOUS</span>
        <span style={{ color: "var(--danger)" }}>30+ — DANGEROUS</span>
      </div>
    </div>
  );
}
