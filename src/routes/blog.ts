import { Context, Hono } from "hono";
import { comment, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();
// creating blog
blogRouter.post("/create_blog", async (c:Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  const prisma = c.get('prisma')

  try {
    const blog_created =  await prisma.blog.create({
      data:{
        BlogData: body.blogData,
        userid  :  userId
       }
      })
    if( !(blog_created.BlogData )){
      return c.json({error:"blog data can not be null"} ,400)
    }
    else{
      return c.json({message:"blog created successfully"} , 200 ,{blog:blog_created.id })
    }
    } catch (error) {
    console.log(error)
    return c.json({error} ,400)
  }
});


// updating blog
blogRouter.patch("/update_blog", async (c:Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  const prisma = c.get('prisma')

    try {
      const update_blog = await prisma.blog.update({
        where:{
          userid:userId ,
          id: body.blogId
        } ,
        data:{
          BlogData:body.blogData
        }
      })
      return c.json({message:"blog updated successfully"}, 200)
    } catch (error) {
      console.log(error)
      return c.json({error:error} , 400)
    }
  

});



blogRouter.get("/:id", async (c:Context) => {
   const id = c.req.param('id');
   const prisma = c.get('prisma');
  
     try {
      const blog = await prisma.blog.findFirst({
      where:{
        id:id
      }
    })
      if(!blog) {
      return c.json({error:"coudnt find blog"} , 400)
    }
      else{
      return c.json({message:"blog founded succesfully"} , 200 , {blog:blog})
    }
  } catch (error) {
    return c.json({error:error} , 400)
  }     
});

// mutliple user 
  blogRouter.get("/bulk/tag",async (c:Context) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    return c.text("Hello Hono!");
  });
// like
  blogRouter.get('/like/:id'  ,async(c:Context)=>{
    const id = c.req.param('id');
    const prisma  = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const userId = c.get('userId');
    try {
      const like_result = await prisma.likes.create({
        data:{
          likeById:userId ,               // the user which  liked the blog      
          likeOnId:id                   // blog id which liked by the user
        }
      }) 
      if(!like_result) {
        return c.json({error:"couldnt  like blog post"} , 400)
      }
        else{
        return c.json({message:"blog liked successfully"} , 200 , {likedOn:like_result.likeOnId})
      }
    } catch (error) {
      return c.json({error:error} , 400 )
    }
    
})
// comment
  blogRouter.get('/comment/:id' , async(c:Context)=>{
    const id = c.req.param('id');
    const body = await c.req.json();
    const userId = c.get('userId');
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
      const comment_user = await prisma.comments.create({
        data:{
          commentById:userId,
          commentOnId:id ,
          comments:{
            create:{
              comment:body.comment
            }
          }
        }
      })
      if (!comment_user) {
        return c.json({error:"can not comment successfully"} , 400)
        
      } else {
        return c.json({message:"commented successfully"} , 200 ,{ comment:comment_user.id})      
      }
    } catch (error) {
      return c.json({error:error} , 400)
    }
  })
 // 
 blogRouter.get("/:category" , async (c)=>{
  const category = c.req.param('category');
  const body  = await c.req.json();
  const blogId = body.blogId;
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  const  category_result = await  prisma.blog.findFirst({
    where:{        
      id:blogId,
    }
  }) 
  if(category_result){
    return c.json({error:"category already added"} , 200);
  }

 }) 
  export default blogRouter;