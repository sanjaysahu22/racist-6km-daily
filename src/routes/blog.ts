import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

import { verify , decode , sign } from "hono/jwt";
const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {  
    userId: string;
  };
}>();

blogRouter.post("/",  async (c) => {
    

   
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
