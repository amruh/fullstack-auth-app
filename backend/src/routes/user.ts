import express from "express";
import { prisma } from "../lib/db.js";
import { generatePasswordResetToken } from "../lib/token.js";
import { sendPasswordResetLinkEmail } from "../lib/mail.js";
import { hash } from "@node-rs/argon2";
import { validateData } from "../middleware/validation.js";
import { NewPasswordSchema, UpdateUserSchema } from "../schemas/schemas.js";
import { authenticate } from "../middleware/authenticate.js";

export const userRouter = express.Router();

// User information
userRouter.get("/api/user/info", authenticate, async (req, res) => {
  res.json({
    message: "User Authenticated!",
    data: {
      ...res.locals.user,
    },
  });
});

// List users in dashboard
userRouter.get("/api/users", authenticate, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      signInCount: true,
      lastLogin: true,
      lastLogout: true,
      createdAt: true,
      hashedPassword: false,
    },
    orderBy: {
      username: "asc"
    }
  });

  res.json({
    message: "User Authenticated!",
    data: users,
  });
});

// Update profile (username)
userRouter.put(
  "/api/user/:id",
  authenticate,
  validateData(UpdateUserSchema),
  async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }

    const findUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        username,
      },
    });

    const { hashedPassword, emailVerified, createdAt, email, ...rest } =
      updatedUser;

    res.json({
      success: true,
      message: "Profile update successfully",
      data: rest,
    });
  }
);

// Send email verification link
userRouter.post("/api/user/send-email-verification", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Missing Token" });
  }

  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return res.status(402).json({ message: "Token does not exists" });
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return res.status(402).json({ message: "Token has expired" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return res.status(402).json({ message: "User not exist" });
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: true },
  });

  await prisma.emailVerificationToken.delete({
    where: { id: existingToken.id },
  });

  res.status(200).json({ message: "Email verified." });
});

// Send password reset link
userRouter.post("/api/user/send-password-reset-link", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return res.status(402).json({ message: "User not exist" });
  }

  const existingResetToken = await prisma.passwordResetToken.findUnique({
    where: {
      email,
    },
  });

  if (existingResetToken) {
    return res
      .status(400)
      .json({ message: "Reset token has been sent before" });
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetLinkEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  res
    .status(200)
    .json({ message: "Password reset link has been sent to your email." });
});

// Password reset handle
userRouter.post(
  "/api/user/password-reset",
  validateData(NewPasswordSchema),
  async (req, res) => {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Missing Token" });
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return res.status(402).json({ message: "Token does not exists" });
    }

    const hasExpired = new Date() > new Date(existingToken.expires);

    if (hasExpired) {
      return res.status(402).json({ message: "Token has expired" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return res.status(402).json({ message: "User not found" });
    }

    const hashedPassword = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        hashedPassword,
      },
    });

    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    res.status(200).json({ message: "Password updated" });
  }
);
