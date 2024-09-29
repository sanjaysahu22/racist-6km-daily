import {  Next } from "hono";
import { Context } from "hono";
import { verify } from "hono/jwt";

export const Authmiddleware2 = async (c: Context, next: Next) => {
  const access_token = c.req.header("Authorization");
  if (access_token == null) {
    return c.json({ error: "no access-token found" }, 400);
  } else {
    const token_to_verify = access_token.split(" ")[1];

    try {
      const token_result = await verify(token_to_verify , c.env.JWT_SECRET)
        await next()
        return c.json({error:"your token is  valid "} , 200)
    } catch (error) {
        console.error("Token verification failed:", error);
        return c.json({ error: "Invalid  token" }, 401);
    }
  }
};
