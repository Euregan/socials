import express from "express";
import validate from "express-zod-safe";
import { z } from "zod";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../database";

const googleRouter = express.Router();

const query = z.object({
  code: z.string(),
});
googleRouter.get("/auth", validate({ query }), async (request, response) => {
  try {
    const rawResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: request.query.code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.API_URL}/google/auth`,
      }),
    }).then((response) => response.json());

    const parsedResponse = z
      .object({
        access_token: z.string(),
        expires_in: z.number(),
        refresh_token: z.string().optional(),
      })
      .safeParse(rawResponse);

    if (parsedResponse.success) {
      const rawGoogleProfile = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedResponse.data.access_token}`,
          },
        }
      ).then((response) => response.json());

      const googleProfile = z
        .object({
          id: z.string(),
          given_name: z.string(),
          family_name: z.string(),
          email: z.string(),
        })
        .parse(rawGoogleProfile);

      let user = await db.user.findFirst({
        where: { email: googleProfile.email },
      });
      if (user) {
        user = await db.user.update({
          where: { id: user.id },
          data: {
            googleAccessToken: parsedResponse.data.access_token,
            googleRefreshToken: parsedResponse.data.refresh_token ?? undefined,
          },
        });
      } else {
        if (!parsedResponse.data.refresh_token) {
          console.error(
            "No refresh token was returned by Google when trying to create a user",
            {
              user: rawGoogleProfile,
              token: rawResponse,
            }
          );
          response.status(500).json({
            message: "Something went wrong while authenticating you",
          });
          return;
        }

        user = await db.user.create({
          data: {
            email: googleProfile.email,
            googleUserId: googleProfile.id,
            googleAccessToken: parsedResponse.data.access_token,
            googleRefreshToken: parsedResponse.data.refresh_token,
          },
        });
      }

      const jwt = jsonwebtoken.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET!
      );

      response.cookie("jwt", jwt);
      response.redirect(process.env.WEB_URL!);
    } else {
      console.error(parsedResponse.error);

      // TODO: Handle when something went wrong
      response.redirect(process.env.WEB_URL!);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({});
  }
});

export default googleRouter;
