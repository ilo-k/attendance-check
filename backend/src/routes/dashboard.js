import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", requireAuth, async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: "year, month 쿼리 파라미터가 필요합니다." });
  }

  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  const records = await prisma.attendance.findMany({
    where: { date: { startsWith: prefix } },
    orderBy: [{ date: "asc" }, { period: "asc" }],
    select: { userId: true, userName: true, date: true, period: true, checkedInAt: true },
  });

  const byUser = new Map();
  for (const r of records) {
    if (!byUser.has(r.userId)) {
      byUser.set(r.userId, { userId: r.userId, nickname: r.userName, count: 0, records: [] });
    }
    const entry = byUser.get(r.userId);
    entry.nickname = r.userName;
    entry.count += 1;
    entry.records.push({ date: r.date, period: r.period, checkedInAt: r.checkedInAt });
  }

  const users = [...byUser.values()].sort(
    (a, b) => b.count - a.count || a.nickname.localeCompare(b.nickname, "ko")
  );

  return res.json({ users });
});
