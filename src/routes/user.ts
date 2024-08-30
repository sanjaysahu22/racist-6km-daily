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
// check route
userRouter.post('/' , (c)=>{
  console.log("chal gaya");
  return new Response('good morning');  
})
//login
    userRouter.post('/signup',async (c) => {
      console.log("prisma")
        const prisma = new PrismaClient ({
            datasourceUrl:c.env.DATABASE_URL
            }).$extends(withAccelerate())
         const body   = await  c.req.json();
          const nothashedpassword =  await body.password;
          console.log(nothashedpassword);
        
           console.log('done');

          
        return c.text('Hello Hono!')

  })
  //register
  userRouter.post('/signin', (c) => {
    return c.text('Hello Hono!')
  })
  userRouter.post('/blog', (c) => {
    return c.text('Hello Hono!')
  })
 console.log("khatqm  ")
  export default userRouter