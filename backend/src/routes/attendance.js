import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const attendanceRouter = Router();

attendanceRouter.get("/", requireAuth, async (req, res) => {
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: "year, month 쿼리 파라미터가 필요합니다." });
  }

  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  const records = await prisma.attendance.findMany({
    where: { date: { startsWith: prefix } },
    orderBy: [{ date: "asc" }, { period: "asc" }],
    select: { date: true, period: true, userName: true, checkedInAt: true },
  });

  return res.json({ records });
});
