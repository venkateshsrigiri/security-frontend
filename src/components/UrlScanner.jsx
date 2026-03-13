import { useState } from "react";
import { scanUrl } from "../services/api";

export default function UrlScanner({ onResult, onLoading }) {
  const [url, setUrl]     = useState("");
  const [error, setError] = useState("");

  const validate = (u) => {
    if (!u.trim())
      return "Please enter a URL.";
    if (!u.startsWith("http://") && !u.startsWith("https://"))
      return "URL must start with http:// or https://";
    return null;
  };

  const handleScan = async () => {
    const err = validate(url);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    onLoading(true);
    try {
      const res = await scanUrl(url.trim());
      onResult(res.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
        e.response?.data?.error   ||
        "Scan failed. Make sure the backend is running on port 8080."
      );
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="panel-body">

      {/* Label */}
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: "0.72rem",
        color: "var(--text3)",
        marginBottom: "10px",
        letterSpacing: "1px",
      }}>
        ENTER TARGET URL
      </div>

      {/* URL input */}
      <input
        className="url-field"
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => { setUrl(e.target.value); setError(""); }}
        onKeyDown={(e) => e.key === "Enter" && handleScan()}
        spellCheck={false}
        autoComplete="off"
      />

      {/* What gets checked — matches your UrlSafetyScanner.java */}
      <div style={{
        fontFamily: "var(--mono)",
        fontSize: "0.7rem",
        color: "var(--text3)",
        lineHeight: 2,
        marginBottom: "4px",
      }}>
        <div>✓ Suspicious keywords (login, verify, bank)</div>
        <div>✓ Shortened URLs (bit.ly, tinyurl)</div>
        <div>✓ Phishing patterns (secure, update-password)</div>
        <div>✓ VirusTotal reputation check</div>
        <div>✓ Page content analysis</div>
      </div>

      {/* Error */}
      {error && <div className="err">{error}</div>}

      {/* Scan button */}
      <button
        className="scan-btn"
        onClick={handleScan}
        disabled={!url.trim()}
      >
        <span>▶ SCAN URL</span>
      </button>
    </div>
  );
}
