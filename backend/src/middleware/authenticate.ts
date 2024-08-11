import type { Request, Response, NextFunction } from "express";
import { lucia } from "../lib/auth.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookieHeader = req.headers.cookie;
  const sessionId = lucia.readSessionCookie(cookieHeader ?? "");

  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { session } = await lucia.validateSession(sessionId);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
}
