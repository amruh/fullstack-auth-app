import express from "express";
import { hash } from "@node-rs/argon2";
import { prisma } from "../lib/db.js";

export const signupRouter = express.Router();

signupRouter.post("/api/signup/credentials", async (req, res) => {
  const { username, password, email } = req.body as {
    username: string;
    email: string;
    password: string;
  };

  if (!email || email.length < 3 || email.length > 51) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid Email",
    });
  }

  if (!username || username.length < 3 || username.length > 31) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid Username",
    });
  }

  if (!password || password.length < 6 || password.length > 255) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid Password",
    });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  // Check existing user
  if (existingUser) {
    return res.status(400).json({
      status: "failed",
      message: "Email already exist",
    });
  }

  // Hash password
  const hashedPassword = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  try {
    // Insert credentials to database
    await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Signup success, You can login now",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Something went wrong",
    });
  }
});
