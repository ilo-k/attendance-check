import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function safeRedirect(path) {
  if (path && /^\/(?!\/|\\)/.test(path)) return path;
  return "/";
}

export function Nickname() {
  const { token, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isChange = Boolean(user?.nickname);
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user: updated } = await api.setNickname(token, nickname);
      updateUser(updated);
      navigate(safeRedirect(params.get("redirect")), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page page-narrow">
      <h1>{isChange ? "닉네임 변경" : "닉네임 설정"}</h1>
      <p>
        {isChange
          ? "닉네임을 바꾸면 이전 출석 기록의 이름도 함께 바뀌어요"
          : "캘린더에 표시될 이름을 입력해주세요"}
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          닉네임
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            required
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "저장 중..." : isChange ? "변경하기" : "저장하고 시작하기"}
        </button>
      </form>
    </div>
  );
}
