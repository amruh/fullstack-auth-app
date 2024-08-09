import express from "express";
import { lucia } from "../lib/auth.js";

export const logoutRouter = express.Router();

logoutRouter.post("/api/logout", async (_, res) => {
  if (!res.locals.session) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized",
    });
  }

  await lucia.invalidateSession(res.locals.session.id);
  return res
    .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
    .json({ status: "success", message: "Logout success" });
});
