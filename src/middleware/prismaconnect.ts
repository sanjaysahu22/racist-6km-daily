    import { PrismaClient } from "@prisma/client/edge";
    import { Context, Next } from "hono";
    import { withAccelerate } from "@prisma/extension-accelerate";


        
    // Prisma middleware to attach the client to the context
    export const prismaMiddleware  = async (c: Context, next: Next) => {
        console.log("trying to connecting to database")
        try {
            const prisma = new PrismaClient({
                datasourceUrl: c.env.DATABASE_URL,
                }).$extends(withAccelerate());
            console.log("connected to database");
            c.set('prisma', prisma);
            await next();
            
        } catch (error) {
            return c.json({error:error , message:"couldnt connect to database"} , 400)
        }        
    };
