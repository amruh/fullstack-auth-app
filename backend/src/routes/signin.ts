import express from "express";
import { verify } from "@node-rs/argon2";
import { lucia } from "../lib/auth.js";
import { PrismaClient } from "@prisma/client";
import { validateData } from "../middleware/validation.js";
import { SignInSchema } from "../schemas/schemas.js";

const prisma = new PrismaClient();

export const signInRouter = express.Router();

signInRouter.post(
  "/api/signin/credentials",
  validateData(SignInSchema),
  async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect email or password",
      });
    }

    const validPassword = await verify(existingUser.hashedPassword!, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Incorrect email or password",
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const cookie = lucia.createSessionCookie(session.id).serialize();
    res.header("Set-Cookie", cookie).json({ accessToken: session });
  }
);
