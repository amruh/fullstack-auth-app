import dotenv from "dotenv";
import { Lucia } from "lucia";
import { GitHub } from "arctic";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.session, prisma.user);

dotenv.config();

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}
