import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { demoUser, handleOrFallback } from "../demo";
import prisma from "../prisma";

const router = Router();
const jwtSecret = process.env.JWT_SECRET ?? "change-me";

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "30d",
    });
    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    handleOrFallback(error, next, () => {
      const token = jwt.sign({ userId: demoUser.id }, jwtSecret, {
        expiresIn: "30d",
      });
      res.status(201).json({
        user: {
          ...demoUser,
          email: req.body.email || demoUser.email,
          name: req.body.name || demoUser.name,
        },
        token,
      });
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "30d",
    });
    return res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    handleOrFallback(error, next, () => {
      const token = jwt.sign({ userId: demoUser.id }, jwtSecret, {
        expiresIn: "30d",
      });
      res.json({
        user: { ...demoUser, email: req.body.email || demoUser.email },
        token,
      });
    });
  }
});

export default router;
