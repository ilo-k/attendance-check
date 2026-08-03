import { Router } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function issueToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

authRouter.post("/google", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "idToken이 필요합니다." });
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: "구글 로그인 검증에 실패했습니다." });
  }

  const user = await prisma.user.upsert({
    where: { googleId: payload.sub },
    update: {},
    create: { googleId: payload.sub, email: payload.email },
  });

  const token = issueToken(user.id);

  return res.json({
    token,
    user: { id: user.id, nickname: user.nickname, email: user.email },
    needsNickname: !user.nickname,
  });
});

authRouter.post("/nickname", requireAuth, async (req, res) => {
  const nickname = req.body.nickname?.trim();

  if (!nickname || nickname.length < 1 || nickname.length > 20) {
    return res.status(400).json({ error: "닉네임은 1~20자로 입력해주세요." });
  }

  const existing = await prisma.user.findUnique({ where: { nickname } });
  if (existing && existing.id !== req.user.id) {
    return res.status(409).json({ error: "이미 사용 중인 닉네임입니다." });
  }

  const [user] = await prisma.$transaction([
    prisma.user.update({ where: { id: req.user.id }, data: { nickname } }),
    prisma.attendance.updateMany({ where: { userId: req.user.id }, data: { userName: nickname } }),
  ]);

  return res.json({ user: { id: user.id, nickname: user.nickname, email: user.email } });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  return res.json({
    user: { id: user.id, nickname: user.nickname, email: user.email },
    needsNickname: !user.nickname,
  });
});
