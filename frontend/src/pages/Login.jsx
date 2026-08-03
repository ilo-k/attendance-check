import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { loadGoogleIdentity } from "../lib/googleIdentity.js";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// 오픈 리다이렉트 방지: "/"로 시작하되 "//"나 "\"로 시작하는 프로토콜 상대 경로는 거부
function safeRedirect(path) {
  if (path && /^\/(?!\/|\\)/.test(path)) return path;
  return "/";
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const buttonRef = useRef(null);

  useEffect(() => {
    async function handleCredentialResponse(response) {
      setError("");
      try {
        const { token, user, needsNickname } = await api.googleLogin(response.credential);
        login(token, user);
        if (needsNickname) {
          navigate(`/nickname?redirect=${encodeURIComponent(params.get("redirect") || "/")}`, {
            replace: true,
          });
        } else {
          navigate(safeRedirect(params.get("redirect")), { replace: true });
        }
      } catch (err) {
        setError(err.message);
      }
    }

    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGoogleIdentity()
      .then(() => {
        if (cancelled) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          locale: "ko",
        });
      })
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [login, navigate, params]);

  return (
    <div className="page page-narrow">
      <h1>출석체크</h1>
      <p>구글 계정으로 로그인해주세요</p>
      <div ref={buttonRef} />
      {!GOOGLE_CLIENT_ID && (
        <p className="error-text">
          VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다. .env를 확인해주세요.
        </p>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
