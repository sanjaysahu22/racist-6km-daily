import { PrismaClient } from "@prisma/client/edge"
import { Hono } from "hono"
import { withAccelerate } from "@prisma/extension-accelerate"
import {hashSync,  compareSync} from 'bcrypt-edge';
import { sign  , verify } from "hono/jwt";



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
//register
    userRouter.post('/signup',async (c) => {
    console.log("prisma")

    const prisma = new PrismaClient ({
            datasourceUrl:c.env.DATABASE_URL
            }).$extends(withAccelerate())

     
           try {

            const body   = await  c.req.json();
            const hashedpassword = hashSync(body.password , 10);
                   
            const usercreated  = await prisma.user.create({
                data:{
                  username:body.username ,
                  password:hashedpassword ,
                  email:body.email
                },
              })


             const payload ={
                sub :usercreated.id ,
                role: 'user' ,
                exp:Math.floor(Date.now()) + 60   
              }

              const token = await sign( payload , c.env.JWT_SECRET );
                           
            
              

             c.header( 'Authorization' ,`bearer ${token}`)

             return c.json({
              message:'login succesful'
             })   
      
      }
      
      catch (error) {
             console.log(error); 
            }
  })  




  //login
  userRouter.post('/signin', async(c) => {

    try {
           
           const prisma = new PrismaClient ({
           datasourceUrl:c.env.DATABASE_URL
           }).$extends(withAccelerate())

           const body = await c.req.json();

           const finduser  = await prisma.user.findUnique({
            where:{
                  username:body.username
                }
            })

                if(!finduser){
                     return c.json({
                    error:"account bna bhen k lode"
                     }) 
                }

                else{
                     const hashpasscheck = compareSync( body.password, finduser.password);

                     if(!hashpasscheck)
                     {
                      return  c.json(
                       {  error:"sahi password daal bhen k lode"}
                       )
                    }

                else{
                      const payload ={
                      sub : finduser.id ,
                      role: 'user' ,
                      exp:Math.floor(Date.now()) + 60   
                       }
    
                      const token = await sign( payload , c.env.JWT_SECRET );
                      
                      
                      c.header('Authorization' ,`bearer ${token}`)
                      return c.json({  message:'login succesful' })
          

                }    
                }

             } 
             catch (error) {
                       console.log(error); 
                       return c.json({
                         err: "kuch toh gadbad hai bhai"
                       })
                       }
               })




         userRouter.post('/blog', async(c) => {

           const prisma = new PrismaClient ({
                    datasourceUrl:c.env.DATABASE_URL
                   }).$extends(withAccelerate())
    
    
      try {
        
        const deleteuser = await prisma.user.deleteMany({});
        console.log(deleteuser);
      } catch (error) {
       console.log(error); 
      }
    return c.text('Hello Hono!')
  })



  

  console.log("khatam  ")
  export default userRouter