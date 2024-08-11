import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cors from "cors";
import type { User, Session } from "lucia";
import { lucia } from "./lib/auth.js";
import { signInRouter } from "./routes/signin.js";
import { signupRouter } from "./routes/signup.js";
import { logoutRouter } from "./routes/logout.js";
import { verifyRequestOrigin } from "lucia";
import { googleSignUpRouter } from "./routes/google.js";
import { facebookSignUpRouter } from "./routes/facebook.js";
import { userRouter } from "./routes/user.js";
import { dashboardRouter } from "./routes/dashboard.js";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));

app.use((req, res, next) => {
  if (req.method === "GET") {
    return next();
  }

  const hostHeader = req.headers.host ?? null;

  if (
    !hostHeader ||
    !verifyRequestOrigin("http://localhost:3001", [hostHeader])
  ) {
    return res.status(403).end();
  }
  return next();
});

app.use(async (req, res, next) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");

  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize()
    );
  }
  if (!session) {
    res.appendHeader(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize()
    );
  }
  res.locals.session = session;
  res.locals.user = user;
  return next();
});

app.use(
  signInRouter,
  signupRouter,
  logoutRouter,
  googleSignUpRouter,
  facebookSignUpRouter,
  userRouter,
  dashboardRouter
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
