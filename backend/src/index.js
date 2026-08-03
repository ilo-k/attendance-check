import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { checkinRouter } from "./routes/checkin.js";
import { attendanceRouter } from "./routes/attendance.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? "*" }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/checkin", checkinRouter);
app.use("/api/attendance", attendanceRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "서버 오류가 발생했습니다." });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Attendance backend listening on port ${port}`);
});
