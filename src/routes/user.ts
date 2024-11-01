import { PrismaClient } from "@prisma/client/edge";
import { Context, Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashSync, compareSync } from "bcrypt-edge";
import {  sign } from "hono/jwt";

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
userRouter.post("/signup", async (c: Context) => {

  const prisma = c.get("prisma");
  try {
    const body = await c.req.json();
    const hashedpassword = hashSync(body.password, 10);
    type user  = {
      id:string ,
      username : string ,
      password: string ,
      email: string
    } 
    // checking if user exist
    const findexist:user = await prisma.user.findFirst({
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
      const usercreated :user= await prisma.user.create({
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
        exp: Math.floor(Date.now() / 100) + 60 * 60,
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
      console.log("sended successfully");
      return c.json({ message: "Login successful!"  , user:usercreated}, 200);
    }
  } catch (error) {
    console.log(error);
    return c.json({ message: "internal server error"  }, 400);
  }
});

//login route
userRouter.post("/signin", async (c: Context) => {
  try {
    console.log("line 93 signin ")
    const body = await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    type user  = {
      id:string ,
      username : string ,
      password: string  ,
      email: string ,
      refresh_token : string | null
    } 
   
    // finding user to get logged in
    const finduser = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });
    
    if (!finduser) {
      console.log("error 113")
      return c.json({ message: "account bna bhen k lode" }, 401);
    } else {
      const hashpasscheck = compareSync(body.password, finduser.password); // comparing password with hashed password
      console.log("error line 117")
      if (!hashpasscheck) {
        return c.json({ error: "sahi password daal bhen k lode" }, 400); // checking  password is correct is not
      } else {
       
        const payload = {
          sub: finduser.id,
          role: "user",
        };

      
        const payload2 = {
          sub: finduser.id,
          role: "user",
          exp: Math.floor(Date.now() / 100) + 60,
        };

        const refresh_token = await sign(payload, c.env.JWT_SECRET); // creating refresh token
        const access_token = await sign(payload2, c.env.JWT_SECRET); //  creating access token

        //   putting refresh token
        const result  = await prisma.user.update({
          where: {
            username: finduser.username,
          },
          data: {
            refresh_Token: refresh_token,
          },
        });

        c.header('Authorization',  `Bearer ${access_token}`);
   
        console.log("sended successfully");
        return c.json({ message: "login succesful"  }); // logged in  message
      }
    }
  } catch (error) {
    console.log(error);
    return c.json({ error: " internal server error" }, 500);
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


console.log("khatam  ");
export default userRouter;
