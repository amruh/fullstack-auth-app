import { generateCodeVerifier, generateState } from "arctic";
import express from "express";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { google, lucia } from "../lib/auth.js";
import { prisma } from "../lib/db.js";

export const googleSignUpRouter = express.Router();

googleSignUpRouter.get("/api/signup/google", async (_, res) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("google_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      })
    )
    .appendHeader(
      "Set-Cookie",
      serializeCookie("code_verifier", codeVerifier, {
        path: "/",
        secure: process.env.NODE_ENV === "PRODUCTION",
        httpOnly: true,
        maxAge: 60 * 10,
      })
    )
    .redirect(url.toString());
});

googleSignUpRouter.get("/api/signup/google/callback", async (req, res) => {
  const stateCookie =
    parseCookies(req.headers.cookie ?? "").get("google_oauth_state") ?? null;
  const codeVerifier =
    parseCookies(req.headers.cookie ?? "").get("code_verifier") ?? null;

  const state = req.query.state?.toString() ?? null;
  const code = req.query.code?.toString() ?? null;

  // verify state
  if (
    !state ||
    !stateCookie ||
    !code ||
    stateCookie !== state ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  const { accessToken } = await google.validateAuthorizationCode(
    code,
    codeVerifier
  );

  const googleRes = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );

  const googleData = (await googleRes.json()) as GoogleUser;

  await prisma.$transaction(async (trx) => {
    const user = await trx.user.findUnique({
      where: {
        id: googleData.id,
      },
    });

    if (!user) {
      const createdUser = await trx.user.create({
        data: {
          id: googleData.id,
          email: googleData.email,
          username: googleData.name,
          signInCount: 1,
          lastLogin: new Date().toISOString(),
        },
      });

      await trx.oAuthAccount.create({
        data: {
          providerId: "google",
          providerUserId: googleData.id,
          userId: createdUser.id,
        },
      });
    } else {
      await trx.user.update({
        where: {
          id: googleData.id,
        },
        data: {
          signInCount: {
            increment: 1,
          },
          lastLogin: new Date().toISOString(),
        },
      });
    }
  });

  const session = await lucia.createSession(googleData.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id).serialize();
  res
    .header("Set-Cookie", sessionCookie)
    .clearCookie("code_verifier")
    .clearCookie("google_oauth_state")
    .redirect("http://localhost:3000/signin");
});

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}
