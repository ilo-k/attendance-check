import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: "아이디, 비밀번호, 이름을 모두 입력해주세요." });
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return res.status(409).json({ error: "이미 사용 중인 아이디입니다." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, name },
  });

  return res.status(201).json({ id: user.id, username: user.username, name: user.name });
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return res.json({ token, user: { id: user.id, username: user.username, name: user.name } });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
