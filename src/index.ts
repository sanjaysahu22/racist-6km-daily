import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blog'
import updateRouter from './routes/updateandlogout'
import { Authmiddleware } from './middleware/promiddleware'
import { Authmiddleware2 } from './middleware/checkmiddleware'
import { prismaMiddleware } from './middleware/prismaconnect'


const app = new Hono<{
   Bindings:{
DATABASE_URL:string ,
JWT_SECRET:String
}
}>()
app.use('*'  , prismaMiddleware)
app.route('/api/v1/user' , userRouter)
app.use('/api/v1/blog/*', Authmiddleware , Authmiddleware2)
app.route('/api/v1/blog' , blogRouter)
app.use('/api/v1/update/*' ,Authmiddleware , Authmiddleware2)
app.route('api/v1/update', updateRouter)
export default app
