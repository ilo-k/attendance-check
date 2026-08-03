import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { getTodaySeoul } from "../lib/time.js";

export const checkinRouter = Router();

const PERIOD_LABEL = { AM: "오전", PM: "오후" };

checkinRouter.post("/", requireAuth, async (req, res) => {
  const { dateStr, period } = getTodaySeoul();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        date: dateStr,
        period,
        userId: req.user.id,
        userName: req.user.name,
      },
    });
    return res.status(201).json({ attendance });
  } catch (err) {
    if (err.code === "P2002") {
      const existing = await prisma.attendance.findUnique({
        where: { date_period: { date: dateStr, period } },
      });
      return res.status(409).json({
        error: `오늘 ${PERIOD_LABEL[period]} 출석은 ${existing?.userName ?? "다른 사람"}님이 이미 체크인해서 마감되었어요.`,
      });
    }
    throw err;
  }
});
