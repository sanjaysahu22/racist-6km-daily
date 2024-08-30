import { PrismaClient } from "@prisma/client/edge"
import { Hono } from "hono"
import { withAccelerate } from "@prisma/extension-accelerate"
import { Jwt } from "hono/utils/jwt"
const userRouter  = new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_SECRET:string
    }
}>
//login
    userRouter.post('/signin', (c) => {
        const prisma = new PrismaClient ({
            datasourceUrl:c.env.DATABASE_URL
        }).$extends(withAccelerate())
        const body = c.req.json;
        
        return c.text('Hello Hono!')
  })
  //register
  userRouter.post('/signup', (c) => {
    return c.text('Hello Hono!')
  })
  userRouter.post('/blog', (c) => {
    return c.text('Hello Hono!')
  })
 
  export default userRouter