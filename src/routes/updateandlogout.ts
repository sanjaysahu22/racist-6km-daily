import { Context, Hono } from "hono";
import { hashSync } from "bcrypt-edge";
import { sign, decode,  } from "hono/jwt";

const updateRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

updateRouter.post("/updatepassword", async (c:Context) => {
  const prisma = c.get('prisma')
  const token = c.req.header("Authorization");
  console.log("yaha error hai");

  if (!token) {
    return c.json({ error: "token does not exist" }, 400);
  } else {
    const access_token = token.split(" ")[1];

    try {
      const body = await c.req.json();
      const hashedpassword = hashSync(body.password, 10);
      const { header, payload } = decode(access_token);

      if (!(typeof payload.sub == "string")) {
        return c.json("this error is not possible");
      } else {
        const usercreated = await prisma.user.update({
          where: {
            id: payload.sub,
          },
          data: {
            password: hashedpassword,
          },
        });
        // creating payload for refresh token
        const payload1 = {
          sub: usercreated.id,
          role: "user",
        };

        // creating payload for access token
        const payload2 = {
          sub: usercreated.id,
          role: "user",
          exp: Math.floor(Date.now() / 100) + 60,
        };

        const refresh_token = await sign(payload1, c.env.JWT_SECRET); // creating refresh token
        const access_new_token = await sign(payload2, c.env.JWT_SECRET); // creating access  token

        // putting refresh token in database
        const result = await prisma.user.update({
          where: {
            id: usercreated.id,
          },
          data: {
            refresh_Token: refresh_token,
          },
        });

        c.header("Authorization", `Bearer ${access_new_token}`); // putting access token in header

        return c.json({ message: "Login successful!" }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return c.status(200);
});

// logout route
updateRouter.post("/logout", async (c:Context) => {
  
  const prisma  = c.get('prisma');
  const token = c.req.header("Authorization");
  console.log("yaha error hai");

  if (!token) {
    return c.json({ error: "token does not exist" }, 400);
  } else {
    const access_token = token.split(" ")[1];

    try {
      const { header, payload } = decode(access_token);

      if (!(typeof payload.sub == "string")) {
        return c.json("this error is not possible");
      } else {
        const delete_user = await prisma.user.update({
          where: {
            id: payload.sub,
          },
          data: {
            refresh_Token: null,
          },
        });
        return c.json({ message: "logged out succesfully" }, 200);
      }
    } catch (error) {
      console.log(error);
    }
  }
});
export default updateRouter;
