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
  googleLogin: (idToken) => request("/api/auth/google", { method: "POST", body: { idToken } }),
  setNickname: (token, nickname) =>
    request("/api/auth/nickname", { method: "POST", token, body: { nickname } }),
  getMe: (token) => request("/api/auth/me", { token }),
  checkIn: (token) => request("/api/checkin", { method: "POST", token }),
  getAttendance: (token, year, month) =>
    request(`/api/attendance?year=${year}&month=${month}`, { token }),
  getDashboard: (token, year, month) =>
    request(`/api/dashboard?year=${year}&month=${month}`, { token }),
};
