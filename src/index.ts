import { Hono } from 'hono'
import userRouter from './routes/user'
import blogRouter from './routes/blog'

const app = new Hono<{
   Bindings:{
DATABASE_URL:string ,
JWT_SECRET:String
}
}>()
console.log("help");
app.route('/api/v1/user' , userRouter)
app.route('/api/v1/blog' , blogRouter)
console.log("done");
export default app
