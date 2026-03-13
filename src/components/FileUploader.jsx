import { useState, useRef } from "react";
import { scanFile } from "../services/api";

export default function FileUploader({ onResult, onLoading }) {
  const [file, setFile]   = useState(null);
  const [over, setOver]   = useState(false);
  const [error, setError] = useState("");
  const inputRef          = useRef();

  const pickFile = (f) => {
    if (f) { setFile(f); setError(""); }
  };

  const handleScan = async () => {
    if (!file) { setError("Please select a file first."); return; }
    setError("");
    onLoading(true);
    try {
      const res = await scanFile(file);
      onResult(res.data);
    } catch (e) {
      setError(
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Scan failed. Make sure the backend is running on port 8080."
      );
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="panel-body">
      <div
        className={`drop-zone ${over ? "over" : ""}`}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pickFile(e.dataTransfer.files[0]); }}
      >
        <div className="drop-icon">⬡</div>
        <div className="drop-label">Drop a file here, or click to browse</div>
        <div className="drop-hint">PDF · TXT · DOCX · HTML · XML · CSV · and more</div>
        {file && <div className="file-chosen">✓ {file.name}</div>}
      </div>

      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => pickFile(e.target.files[0])}
      />

      {error && <div className="err">{error}</div>}

      <button className="scan-btn" onClick={handleScan} disabled={!file}>
        <span>▶ SCAN FILE</span>
      </button>
    </div>
  );
}