// Your backend stores findings as a single comma-separated string, e.g:
// "Suspicious words have been found:password, Sensitive email detected, Suspicious links found: https://..."
//
// This component splits that string and categorises each finding
// based on the exact text your scanners produce.

function categorise(finding) {
  const f = finding.toLowerCase();

  // KeyWordsScanner.java  → "Suspicious words have been found:XXX"
  if (f.includes("suspicious words"))
    return { category: "Suspicious Keyword", severity: "MEDIUM", icon: "⚠" };

  // SensitiveDataScanner.java → "Sensitive email detected"
  if (f.includes("sensitive email"))
    return { category: "Sensitive Data", severity: "HIGH", icon: "✉" };

  // SensitiveDataScanner.java → "Possible credit card number detected"
  if (f.includes("credit card"))
    return { category: "Sensitive Data", severity: "CRITICAL", icon: "💳" };

  // LinksScanner.java → "Suspicious links found: https://..."
  if (f.includes("suspicious links"))
    return { category: "Suspicious Link", severity: "MEDIUM", icon: "🔗" };

  // UrlSafetyScanner.java → "Suspicious keywords found in url"
  if (f.includes("suspicious keywords found in url"))
    return { category: "URL Pattern", severity: "MEDIUM", icon: "🌐" };

  // UrlSafetyScanner.java → "Shortened URL detected"
  if (f.includes("shortened url"))
    return { category: "URL Obfuscation", severity: "MEDIUM", icon: "🔀" };

  // UrlSafetyScanner.java → "Potential phishing pattern detected"
  if (f.includes("phishing"))
    return { category: "Phishing", severity: "HIGH", icon: "🎣" };

  // FileTypeScanner → "Dangerous file type"
  if (f.includes("dangerous file type"))
    return { category: "Dangerous File", severity: "HIGH", icon: "📁" };

  // ScriptScanner → "Embedded script" / "Potential malicious script"
  if (f.includes("script"))
    return { category: "Script Injection", severity: "CRITICAL", icon: "⚡" };

  // VirusTotalService → "ViralTotal flagged URL as suspicious"
  if (f.includes("virustotal") || f.includes("viraltotal"))
    return { category: "VirusTotal Flag", severity: "CRITICAL", icon: "🛡" };

  // UrlScanService page content check
  if (f.includes("suspicious webpage"))
    return { category: "Page Content", severity: "MEDIUM", icon: "🌐" };

  // fallback
  return { category: "Other", severity: "LOW", icon: "ℹ" };
}

function SeverityBadge({ severity }) {
  return <span className={`sev ${severity}`}>{severity}</span>;
}

export default function FindingsTable({ findings }) {
  // findings is a raw comma-separated string from your backend
  // e.g. "Suspicious words have been found:password, Sensitive email detected"

  if (!findings || findings.trim() === "") {
    return (
      <div style={{
        padding: "20px",
        fontFamily: "var(--mono)",
        fontSize: "0.82rem",
        color: "var(--safe)",
      }}>
        ✓ No threats detected in this scan.
      </div>
    );
  }

  // Split by ", " — be careful not to split URLs that contain commas
  const items = findings
    .split(/,\s*(?=[A-Z])/)   // split on ", " only when next char is uppercase
    .map((f) => f.trim())
    .filter(Boolean);

  return (
    <table className="findings-table">
      <thead>
        <tr>
          <th style={{ width: 30 }}>#</th>
          <th style={{ width: 140 }}>Category</th>
          <th style={{ width: 90 }}>Severity</th>
          <th>Finding</th>
        </tr>
      </thead>
      <tbody>
        {items.map((finding, i) => {
          const { category, severity, icon } = categorise(finding);
          return (
            <tr key={i}>
              <td style={{
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                color: "var(--text3)",
              }}>
                {String(i + 1).padStart(2, "0")}
              </td>
              <td>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{icon}</span>
                  <span style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.83rem",
                  }}>
                    {category}
                  </span>
                </span>
              </td>
              <td>
                <SeverityBadge severity={severity} />
              </td>
              <td style={{
                color: "var(--text2)",
                fontSize: "0.83rem",
                lineHeight: 1.5,
              }}>
                {finding}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
