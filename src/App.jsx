import { useState } from "react";
import "./styles/App.css";
import FileUploader from "./components/FileUploader";
import UrlScanner   from "./components/UrlScanner";
import HistoryPanel from "./components/HistoryPanel";
import ReportPanel  from "./components/ReportPanel";

export default function App() {
  const [tab, setTab]         = useState("file");
  const [loading, setLoading] = useState(false);
  const [report, setReport]   = useState(null);

  const handleResult = (data) => {
    setReport(data);
    setTimeout(() => {
      document.getElementById("report-anchor")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleHistorySelect = (scan) => {
    setReport(scan);
    setTab("file");
  };

  return (
    <div className="app-shell">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-left">
          <div className="logo-icon">🛡</div>
          <div>
            <h1>Smart Security Scanner</h1>
            <div className="header-sub">THREAT DETECTION SYSTEM v1.0</div>
          </div>
        </div>
        <div className="header-status">
          <span className="pulse-dot" />
          SYSTEM ONLINE
        </div>
      </header>

      {/* ── Main grid ── */}
      <div className="main-grid">

        {/* ── Left: input panel ── */}
        <div>
          <div className="panel">
            <div className="tab-bar">
              <button
                className={`tab ${tab === "file" ? "active" : ""}`}
                onClick={() => setTab("file")}
              >
                ⬡ FILE
              </button>
              <button
                className={`tab ${tab === "url" ? "active" : ""}`}
                onClick={() => setTab("url")}
              >
                ◈ URL
              </button>
              <button
                className={`tab ${tab === "history" ? "active" : ""}`}
                onClick={() => setTab("history")}
              >
                ≡ HISTORY
              </button>
            </div>

            {tab === "file"    && <FileUploader onResult={handleResult} onLoading={setLoading} />}
            {tab === "url"     && <UrlScanner   onResult={handleResult} onLoading={setLoading} />}
            {tab === "history" && <HistoryPanel onSelect={handleHistorySelect} />}
          </div>

          {/* ── Info box ── */}
          <div style={{
            marginTop: 16, padding: "14px 18px",
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: 8, fontFamily: "var(--mono)", fontSize: "0.7rem",
            color: "var(--text3)", lineHeight: 2
          }}>
            <div style={{ color: "var(--accent)", marginBottom: 6, letterSpacing: "1.5px" }}>
              ◈ DETECTION CAPABILITIES
            </div>
            <div>✓ Suspicious keywords &amp; malware indicators</div>
            <div>✓ Sensitive data — emails, credentials, API keys</div>
            <div>✓ Embedded scripts &amp; injection patterns</div>
            <div>✓ Suspicious link detection</div>
            <div>✓ Dangerous file type detection</div>
            <div>✓ VirusTotal URL reputation check</div>
          </div>
        </div>

        {/* ── Right: results ── */}
        <div id="report-anchor">
          {loading && (
            <div className="panel">
              <div className="scanning-wrap">
                <div className="scan-ring" />
                <div className="scan-phase">SCANNING TARGET...</div>
                <div style={{
                  marginTop: 12, fontFamily: "var(--mono)",
                  fontSize: "0.68rem", color: "var(--text3)"
                }}>
                  Running threat analysis
                </div>
              </div>
            </div>
          )}

          {!loading && !report && (
            <div className="panel">
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <div>AWAITING SCAN TARGET</div>
                <div style={{
                  marginTop: 8, color: "var(--text3)", fontSize: "0.72rem"
                }}>
                  Upload a file or enter a URL to begin
                </div>
              </div>
            </div>
          )}

          {!loading && report && <ReportPanel report={report} />}
        </div>

      </div>
    </div>
  );
}
