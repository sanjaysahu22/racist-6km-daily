// implement refresh token and access token in jwt
// create blog 
import { Hono, Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { Context } from "hono";

 export const Authmiddleware  =(c:Context , next:Next)=>{
    const token = c.req.header('Authorization');
    console.log(token);
    if(!token){
        return c.json({
            error:"lode login kar"
        })
    }
    else{
        next();
    }
}
    
