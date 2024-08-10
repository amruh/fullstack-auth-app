import { prisma } from "./db.js";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await prisma.emailVerificationToken.findUnique({
    where: { email: email },
  });

  if (existingToken) {
    await prisma.emailVerificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const newToken = await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return newToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await prisma.passwordResetToken.findUnique({
    where: { email: email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
