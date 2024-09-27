import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashSync, compareSync } from "bcrypt-edge";
import { decode, sign, verify } from "hono/jwt";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// check route
userRouter.post("/", (c) => {
  console.log("chal gaya");
  return new Response("good morning");
});
//register
userRouter.post("/signup", async (c) => {
  console.log("prisma");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const hashedpassword = hashSync(body.password, 10);

    // checking if user exist
    const findexist = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (findexist) {
      console.log("user already exist");
      return c.json({
        error: "user alreadyy exist",
      });
    } else {
      // creating user
      const usercreated = await prisma.user.create({
        data: {
          username: body.username,
          password: hashedpassword,
          email: body.email,
        },
      });

      // creating payload for refresh token
      const payload = {
        sub: usercreated.id,
        role: "user",
      };

      // creating payload for access token
      const payload2 = {
        sub: usercreated.id,
        role: "user",
        exp: Math.floor(Date.now() / 100) + 60,
      };

      const refresh_token = await sign(payload, c.env.JWT_SECRET); // creating refresh token
      const access_token = await sign(payload2, c.env.JWT_SECRET); // creating access  token

      // putting refresh token in database
      const result = await prisma.user.update({
        where: {
          id: usercreated.id,
        },
        data: {
          refresh_Token: refresh_token,
        },
      });

      c.header("Authorization", `Bearer ${access_token}`); // putting access token in header

      return c.json({ message: "Login successful!" }, 200);
    }
  } catch (error) {
    console.log(error);
    return c.json({ message: "internal server error" }, 500);
  }
});

//login route
userRouter.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // finding user to get logged in
    const finduser = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    console.log("line 120");
    // checking user if  exists
    if (!finduser) {
      return c.json({ error: "account bna bhen k lode" }, 400);
    } else {
      const hashpasscheck = compareSync(body.password, finduser.password); // comparing password with hashed password

      if (!hashpasscheck) {
        return c.json({ error: "sahi password daal bhen k lode" }, 400); // checking  password is correct is not
      } else {
        // creating payload for refresh token
        const payload = {
          sub: finduser.id,
          role: "user",
        };

        // creating payload for access  token
        const payload2 = {
          sub: finduser.id,
          role: "user",
          exp: Math.floor(Date.now() / 100) + 60,
        };

        const refresh_token = await sign(payload, c.env.JWT_SECRET); // creating refresh token
        const access_token = await sign(payload2, c.env.JWT_SECRET); //  creating access token

        //   putting refresh token
        const result = await prisma.user.update({
          where: {
            username: finduser.username,
          },
          data: {
            refresh_Token: refresh_token,
          },
        });

        c.header("Authorization", `Bearer ${access_token}`); // putting refresh token in auth header
        return c.json({ message: "login succesful" }); // logged in  message
      }
    }
  } catch (error) {
    return c.json({ err: " internal server error" }, 500);
  }
});

userRouter.post("/blog", async (c) => {
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

// update password
userRouter.post('/update_password' , )

console.log("khatam  ");
export default userRouter;
