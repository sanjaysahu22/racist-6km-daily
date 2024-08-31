import { verify } from "hono/jwt";
    
    export  const middleware = (app:any)=>{
    app.use('/api/v1/blog/*' ,(c :any,next:any)=>{


        const token = c.req.header('Autorization').split(" ")[1];
            
        if(!token){

            return c.json({
            error:'access denied , authorization failed'
            })
            
        }

        else{

               const tokenresponse = verify(token, c.env.JWT_SECRET);
                
                if(!tokenresponse){
            
                    return  c.json({
                        error :"backchodi mat kar lode"
                    })
            
                }

                else{
                 next();
                }
            
        }

    })
   } 