import dotenv from "dotenv";
import { Lucia } from "lucia";
import { GitHub, Google } from "arctic";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient, User } from "@prisma/client";
import { Facebook } from "arctic";

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

export const google = new Google(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  "http://localhost:3001/api/signup/google/callback"
);

export const facebook = new Facebook(
  process.env.FACEBOOK_CLIENT_ID!,
  process.env.FACEBOOK_CLIENT_SECRET!,
  "http://localhost:3001/api/signup/facebook/callback"
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}
