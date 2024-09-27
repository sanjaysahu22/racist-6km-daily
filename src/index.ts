import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blog'
import updateRouter from './routes/updateandlogout'
const app = new Hono<{
   Bindings:{
DATABASE_URL:string ,
JWT_SECRET:String
}
}>()
app.route('/api/v1/user' , userRouter)
app.route('/api/v1/blog' , blogRouter)
app.route('api/v1/update', updateRouter)
export default app
