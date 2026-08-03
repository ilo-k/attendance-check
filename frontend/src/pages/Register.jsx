import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(username, password, name);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          이름
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
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
          {loading ? "가입 중..." : "가입하기"}
        </button>
      </form>
      <p>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}
