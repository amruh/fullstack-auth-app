import { generateState } from "arctic";
import express from "express";
import { parseCookies, serializeCookie } from "oslo/cookie";
import { facebook, lucia } from "../lib/auth.js";
import { prisma } from "../lib/db.js";

export const facebookSignUpRouter = express.Router();

facebookSignUpRouter.get("/api/signup/facebook", async (_, res) => {
  const state = generateState();
  const url = await facebook.createAuthorizationURL(state, {
    scopes: ["public_profile", "email"],
  });

  res
    .appendHeader(
      "Set-Cookie",
      serializeCookie("facebook_oauth_state", state, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      })
    )
    .redirect(url.toString());
});

facebookSignUpRouter.get("/api/signup/facebook/callback", async (req, res) => {
  const stateCookie =
    parseCookies(req.headers.cookie ?? "").get("facebook_oauth_state") ?? null;

  const state = req.query.state?.toString() ?? null;
  const code = req.query.code?.toString() ?? null;

  // verify state
  if (!state || !stateCookie || !code || stateCookie !== state) {
    return new Response(null, {
      status: 400,
    });
  }

  const { accessToken } =
    await facebook.validateAuthorizationCode(code);

  const facebookRes = await fetch(
    `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`,
    {
      method: "GET",
    }
  );

  const facebookData = (await facebookRes.json()) as FacebookUser;

  await prisma.$transaction(async (trx) => {
    const user = await trx.user.findUnique({
      where: {
        id: facebookData.id,
      },
    });

    if (!user) {
      const createdUser = await trx.user.create({
        data: {
          id: facebookData.id,
          email: facebookData.email,
          username: facebookData.name,
          signInCount: 1,
          lastLogin: new Date().toISOString(),
        },
      });

      await trx.oAuthAccount.create({
        data: {
          providerId: "facebook",
          providerUserId: facebookData.id,
          userId: createdUser.id,
        },
      });
    } else {
      await trx.user.update({
        where: {
          id: facebookData.id,
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

  const session = await lucia.createSession(facebookData.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id).serialize();
  res
    .header("Set-Cookie", sessionCookie)
    .clearCookie("facebook_oauth_state")
    .redirect("http://localhost:3000/signin");
});

interface FacebookUser {
  name: string;
  id: string;
  email: string;
  picture: {
    height: number;
    is_silhouette: boolean;
    url: string;
    width: number;
  };
}
