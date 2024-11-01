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
      const token_details = decode(token_to_verify);
      const currentTime = Math.floor(Date.now() / 1000);
     const token_time:any =token_details.payload.exp ;
      if (token_time < currentTime){
        const new_payload = {
            sub: token_details.payload.sub,
            role: token_details.payload.role,
            exp: Math.floor(Date.now() / 1000) +(10* 60 * 60),
          };
          const new_access_token = await sign(new_payload, c.env.JWT_SECRET);
          c.header("Authorization", `Bearer ${new_access_token}`);
          await next() 
          return c.json({ message: "Token refreshed"}, 200);
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
/*blogRouter.get("/comment/", async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  const prisma = c.get('primsa');
  console.log("line 111")
  try {
    const comment_user = await prisma.comments.create({
      data: {
        commentById: userId,
        commentOnId: body.id,
      }
    });
    const put_comment = await prisma.comment.create({
      data:{
        commentsId:comment_user.id ,
        comment:body.comment
      }
    })
    console.log("line124")
      return c.json({ message: "commented successfully" }, 200, {
        comment: comment_user.commentById,
      });
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});*/