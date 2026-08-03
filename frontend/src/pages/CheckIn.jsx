import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Modal } from "../components/Modal.jsx";

export function CheckIn() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | already-checked | error
  const [message, setMessage] = useState("");
  const requestedRef = useRef(false);

  useEffect(() => {
    // React 18 StrictMode가 개발 모드에서 effect를 두 번 실행하는데,
    // 체크인은 멱등하지 않은 요청이라 실수로 중복 호출되지 않도록 가드를 둔다.
    if (requestedRef.current) return;
    requestedRef.current = true;

    api
      .checkIn(token)
      .then(() => {
        setStatus("success");
      })
      .catch((err) => {
        if (err.status === 409) {
          setStatus("already-checked");
          setMessage(err.message);
        } else {
          setStatus("error");
          setMessage(err.message);
        }
      });
  }, [token]);

  return (
    <div className="page page-narrow">
      <h1>출석 체크</h1>

      {status === "loading" && <p>체크인 처리 중...</p>}

      {status === "success" && (
        <>
          <p className="success-text">출석 체크가 완료되었습니다!</p>
          <Link to="/">캘린더로 이동</Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="error-text">{message}</p>
          <Link to="/">캘린더로 이동</Link>
        </>
      )}

      {status === "already-checked" && (
        <Modal
          title="출석 마감"
          message={message}
          onClose={() => navigate("/", { replace: true })}
        />
      )}
    </div>
  );
}
