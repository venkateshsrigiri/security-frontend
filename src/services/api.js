import axios from "axios";

// Your controller: @RequestMapping("/scan")
// Your CORS:       @CrossOrigin(origins = "http://localhost:5173")
const BASE = "https://security-scanner-qnes.onrender.com";

// POST /scan/file  — multipart file upload
export const scanFile = (file) => {
  const form = new FormData();
  form.append("file", file);
  return axios.post(`${BASE}/file`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// POST /scan/url  — body: { url: "https://..." }
export const scanUrl = (url) =>
  axios.post(`${BASE}/url`, { url });

// GET /scan/history  — returns List<ScanResult>
export const getHistory = () =>
  axios.get(`${BASE}/history`);

// GET /scan/history/{id}
export const getScanById = (id) =>
  axios.get(`${BASE}/history/${id}`);

// DELETE /scan/history/{id}
export const deleteScan = (id) =>
  axios.delete(`${BASE}/history/${id}`);