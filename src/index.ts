import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blog'
import updateRouter from './routes/updateandlogout'
import { prismaMiddleware } from './middleware/prismaconnect'
import { Authmiddleware } from "./middleware/promiddleware";
import { Authmiddleware2 } from "./middleware/checkmiddleware";
import actRouter from './routes/userblog'


const app = new Hono<{
   Bindings:{
DATABASE_URL:string ,
JWT_SECRET:String
}  
}>()
app.use('*', prismaMiddleware)
app.route('/api/v1/user' , userRouter)
app.use('/api/v1/blog/*', prismaMiddleware ,Authmiddleware , Authmiddleware2 , )
app.route('/api/v1/blog' , blogRouter)
app.use('/api/v1/update/*',prismaMiddleware, Authmiddleware2 ,Authmiddleware    )
app.route('api/v1/update', updateRouter)
app.use('api/v1/act/*' , prismaMiddleware ,  Authmiddleware2 ,Authmiddleware )
app.route('api/v1/act' , actRouter)

export default app
