import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // 오픈 리다이렉트 방지: "/"로 시작하되 "//"나 "\"로 시작하는 프로토콜 상대 경로는 거부
  function safeRedirect(path) {
    if (path && /^\/(?!\/|\\)/.test(path)) return path;
    return "/";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.login(username, password);
      login(token, user);
      navigate(safeRedirect(params.get("redirect")), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          아이디
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <p>
        계정이 없으신가요? <Link to="/register">회원가입</Link>
      </p>
    </div>
  );
}
