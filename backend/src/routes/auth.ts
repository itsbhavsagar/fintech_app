import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
      token,
    });
  } catch (error) {
    next(error);
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

    let isValid = false;
    if (user.email === "demo@brickshare.com") {
      isValid = password === user.password;
    } else {
      isValid = await bcrypt.compare(password, user.password);
    }
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "30d",
    });
    return res.json({
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }

    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) {
      return res.status(404).json({ error: "No account found with this phone number." });
    }

    const { sendVerificationToken } = await import("../lib/twilio");
    await sendVerificationToken(phone);

    return res.json({ message: "Verification token sent successfully." });
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    const { phone, otp, newPassword } = req.body;
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const { checkVerificationToken } = await import("../lib/twilio");
    const isValid = await checkVerificationToken(phone, otp);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const user = await prisma.user.findFirst({ where: { phone } });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.updateMany({
      where: { phone },
      data: { password: hashedPassword },
    });

    return res.json({ message: "Password reset successfully.", email: user?.email });
  } catch (error) {
    next(error);
  }
});

export default router;
