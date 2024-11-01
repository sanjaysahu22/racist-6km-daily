import { Next } from "hono";
import { Context } from "hono";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const Authmiddleware2 = async (c: Context, next: Next) => {
  const access_token = c.req.header('Authorization');
  if (!access_token) {
    return c.json({ error: "no access granted" }, 400);
  } else {
    const token_to_verify = access_token.split(" ")[1];  // Extract token from Bearer
    if (!token_to_verify) {
      return c.json({ error: "Authorization header format is invalid" }, 400);
    }
    try {
      const token_result: JWTPayload = await verify(token_to_verify, c.env.JWT_SECRET);      
      c.set('userId', token_result.sub)
      await next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return c.json({ error: "Invalid token" }, 401);  // Return unauthorized if token is invalid
    }
  }
};
