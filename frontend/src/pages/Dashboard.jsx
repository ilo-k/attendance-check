import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const PERIOD_LABEL = { AM: "오전", PM: "오후" };

function formatRecord(record) {
  const [, month, day] = record.date.split("-");
  const time = new Date(record.checkedInAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${Number(month)}월 ${Number(day)}일 ${PERIOD_LABEL[record.period]} ${time}`;
}

export function Dashboard() {
  const { token } = useAuth();
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [users, setUsers] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setExpandedUserId(null);
    api
      .getDashboard(token, viewDate.year, viewDate.month)
      .then(({ users }) => !cancelled && setUsers(users))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [token, viewDate]);

  function changeMonth(delta) {
    setViewDate(({ year, month }) => {
      const d = new Date(year, month - 1 + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() + 1 };
    });
  }

  return (
    <div className="page">
      <header className="home-header">
        <h1>출석 현황</h1>
        <Link to="/" className="btn">
          캘린더로 이동
        </Link>
      </header>

      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>
          {viewDate.year}년 {viewDate.month}월
        </h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {users.length === 0 && !error && <p>이번 달 출석 기록이 없어요.</p>}

      <ul className="dashboard-list">
        {users.map((u) => (
          <li key={u.userId} className="dashboard-row">
            <div className="dashboard-row-summary">
              <span className="dashboard-name">{u.nickname}</span>
              <span className="dashboard-count">{u.count}회</span>
              <button
                onClick={() => setExpandedUserId(expandedUserId === u.userId ? null : u.userId)}
              >
                {expandedUserId === u.userId ? "접기" : "상세보기"}
              </button>
            </div>
            {expandedUserId === u.userId && (
              <ul className="dashboard-detail">
                {u.records.map((r, i) => (
                  <li key={i}>{formatRecord(r)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
