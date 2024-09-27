import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Authmiddleware } from "../promiddleware";
import { verify } from "hono/jwt";
const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {  
    userId: string;
  };
}>();
//protected route
blogRouter.use("/*", async (c, next) => {
  let token = c.req.header("Authorization");
  if (!token || token==" ") {
    return c.json({
      error: "no token founded",
    });
  } else {
     token = token.split(' ')[1];
    const verifyresult = await verify(token, c.env.JWT_SECRET);
    if (!verifyresult) {
      return c.json({
        error: "backchodi mat kar lode",
      });
    } else {
      next();
      return c.json({
        message: "token verified",
      });
    }
  }
});

//create blog route
blogRouter.post("/", (c) => {
  return c.text("Hello Hono!");
});
blogRouter.put("/", (c) => {
  return c.text("Hello Hono!");
});
blogRouter.get("/:id", (c) => {
  return c.text("Hello Hono!");
});
blogRouter.get("/bulk", (c) => {
  return c.text("Hello Hono!");
});
export default blogRouter;
