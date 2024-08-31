import { Hono} from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const blogRouter = new Hono <{
    Bindings:{
        DATABASE_URL:string ,
        JWT_SECRET:string
    }
    Variables:{
      userId :string
    }
}>


    blogRouter.post('/blog', (c) => {
    return c.text('Hello Hono!')
  })
    blogRouter.put('/blog', (c) => {
    return c.text('Hello Hono!')
    })
  blogRouter.get('/blog/:id', (c) => {
    return c.text('Hello Hono!')
  })
  blogRouter.get('/blog/bulk', (c) => {
    return c.text('Hello Hono!')
  })
  
  export default blogRouter;