import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blog'
import updateRouter from './routes/updateandlogout'
import { prismaMiddleware } from './middleware/prismaconnect'
import { Authmiddleware } from "./middleware/promiddleware";
import { Authmiddleware2 } from "./middleware/checkmiddleware";
import actRouter from './routes/userblog'
import { cors } from 'hono/cors'


const app = new Hono<{
   Bindings:{
DATABASE_URL:string ,
JWT_SECRET:String
}  
}>()
app.use(
   '*',
   cors({
     origin: 'http://localhost:5173', // Specify the frontend origin explicitly
     allowHeaders: ['Authorization', 'Content-Type'], // Allow Authorization header
     allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     exposeHeaders: ['Authorization'],
     credentials: true, // Allow credentials (e.g., cookies, Authorization header)
   })
 );
app.use('*', prismaMiddleware)
app.route('/api/v1/user'  , userRouter)
app.use('/api/v1/blog/*',Authmiddleware ,Authmiddleware2  )
app.route('/api/v1/blog' , blogRouter)
app.use('/api/v1/update/*', Authmiddleware , Authmiddleware2    )
app.route('api/v1/update', updateRouter)
app.use('api/v1/act/*' ,  Authmiddleware ,Authmiddleware2 )
app.route('api/v1/act' , actRouter)

export default app
