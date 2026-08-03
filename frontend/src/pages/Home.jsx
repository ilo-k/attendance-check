import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateStr(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  const days = [];
  for (let i = 0; i < leadingBlanks; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export function Home() {
  const { token, user, logout } = useAuth();
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });
  const [recordsByDate, setRecordsByDate] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .getAttendance(token, viewDate.year, viewDate.month)
      .then(({ records }) => {
        if (cancelled) return;
        const grouped = {};
        for (const r of records) {
          grouped[r.date] = grouped[r.date] || {};
          grouped[r.date][r.period] = r;
        }
        setRecordsByDate(grouped);
      })
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

  const days = buildCalendarDays(viewDate.year, viewDate.month);

  return (
    <div className="page">
      <header className="home-header">
        <div>
          <strong>{user?.nickname}</strong>님 환영합니다
        </div>
        <div className="home-actions">
          <Link to="/checkin">체크인 (QR 스캔)</Link>
          <Link to="/nickname">닉네임 변경</Link>
          <button onClick={logout}>로그아웃</button>
        </div>
      </header>

      <div className="calendar-nav">
        <button onClick={() => changeMonth(-1)}>&lt;</button>
        <h2>
          {viewDate.year}년 {viewDate.month}월
        </h2>
        <button onClick={() => changeMonth(1)}>&gt;</button>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="calendar-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
        {days.map((day, idx) => {
          if (day === null) return <div key={`blank-${idx}`} className="calendar-cell empty" />;
          const dateStr = toDateStr(viewDate.year, viewDate.month, day);
          const record = recordsByDate[dateStr];
          return (
            <div key={dateStr} className="calendar-cell">
              <div className="calendar-day">{day}</div>
              {record?.AM && (
                <div className="calendar-entry">
                  오전 {record.AM.userName} (
                  {new Date(record.AM.checkedInAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  )
                </div>
              )}
              {record?.PM && (
                <div className="calendar-entry">
                  오후 {record.PM.userName} (
                  {new Date(record.PM.checkedInAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                  )
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="dashboard-link">
        <Link to="/dashboard">
          <button type="button">출석 현황 대시보드</button>
        </Link>
      </div>
    </div>
  );
}
