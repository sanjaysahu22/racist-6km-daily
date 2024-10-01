import { Next } from "hono";
import { Context } from "hono";
import { decode, sign } from "hono/jwt";

export const Authmiddleware = async (c: Context, next: Next) => {
  const access_token = c.req.header("Authorization"); 
  if (access_token == null) {
    return c.json({ error: "no access-token found" }, 400);
  } else {
    const token_to_verify = access_token.split(" ")[1];

    try {
        console.log("l19")
      const token_details = decode(token_to_verify);
      const currentTime = Math.floor(Date.now() / 1000);
      if (typeof token_details.payload.exp == 'number'  && token_details.payload.exp < currentTime){
        const new_payload = {
            sub: token_details.payload.sub,
            role: token_details.payload.role,
            exp: Math.floor(Date.now() / 100) +( 60 * 60),
          };
          const new_access_token = await sign(new_payload, c.env.JWT_SECRET);
    
          c.header("Authorization", `Bearer ${new_access_token}`);
          await next() 
          return c.json({ message: "Token refreshed", accessToken: new_access_token }, 200);
      }
     else{
        await next()
     }
      
       
    } catch (error) {
        console.error("Token verification failed:", error);
        return c.json({ error: "Invalid or expired token" }, 401);
    }
  }
};
