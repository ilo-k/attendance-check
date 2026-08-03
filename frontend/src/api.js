const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "요청에 실패했습니다.");
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (username, password, name) =>
    request("/api/auth/register", { method: "POST", body: { username, password, name } }),
  login: (username, password) =>
    request("/api/auth/login", { method: "POST", body: { username, password } }),
  checkIn: (token) => request("/api/checkin", { method: "POST", token }),
  getAttendance: (token, year, month) =>
    request(`/api/attendance?year=${year}&month=${month}`, { token }),
};
