import { PrismaClient } from "@prisma/client/edge";
import { Context, Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashSync, compareSync } from "bcrypt-edge";
import {  sign } from "hono/jwt";

const followRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();



followRouter.post("/blog", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const deleteuser = await prisma.user.deleteMany({});
    console.log(deleteuser);
  } catch (error) {
    console.log(error);
  }
  return c.text("Hello Hono!");
});

console.log("khatam  ");
export default followRouter;
