import express from "express";
import { hash } from "@node-rs/argon2";
import { prisma } from "../lib/db.js";
import { validateData } from "../middleware/validation.js";
import { SignUpSchema } from "../schemas/schemas.js";
import { generateVerificationToken } from "../lib/token.js";
import { sendVerificationLinkEmail } from "../lib/mail.js";

export const signupRouter = express.Router();

signupRouter.post(
  "/api/signup/credentials",
  validateData(SignUpSchema),
  async (req, res) => {
    const { email, password, name } = req.body;

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
          username: name,
          email,
          hashedPassword,
        },
      });

      const verificationToken = await generateVerificationToken(email);

      await sendVerificationLinkEmail(
        verificationToken.email,
        verificationToken.token
      );

      return res.status(200).json({
        status: "success",
        message: "Check your email, we just send a verification link",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: "failed",
        message: "Something went wrong",
      });
    }
  }
);
