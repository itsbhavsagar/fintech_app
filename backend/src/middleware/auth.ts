import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const secret = process.env.JWT_SECRET ?? "change-me";
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.user = { id: payload.userId } as any;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token." });
  }
}
