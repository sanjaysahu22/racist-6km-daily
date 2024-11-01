import { Context, Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma:string;
  };
}>();
// creating blog
blogRouter.post("/create_blog", async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const prisma = c.get("prisma");
  try {
    const blog_created = await prisma.blog.create({
      data: {
        BlogData: body.blogData,
        userid: userId,
      },
    });
    return c.json({ message:"blog created successfully" , blog_details:blog_created}, 200);
  } catch (error) {
    return c.json({ error : error}, 400);
  }
});

// updating blog
blogRouter.patch("/update_blog", async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const prisma = c.get("prisma");

  try {
      const update_blog = await prisma.blog.update({
      where: {
        userid: userId,
        id: body.blogId,
      },
      data: {
        BlogData: body.blogData,
      },
    });
    return c.json({ message: "blog updated successfully"  , blog_details:update_blog}, 200);
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

blogRouter.get("/:id", async (c: Context) => {
  const id = c.req.param("id");
  const prisma = c.get("prisma");

  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id: id,
      },
    });
    if (!blog) {
      return c.json({ error: "coudnt find blog" }, 400);
    } else {
      return c.json({ message: "blog founded succesfully" }, 200, {
        blog: blog,
      });
    }
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

// like
blogRouter.get("/like/:id", async (c: Context) => {
  const  id = c.req.param('id');
  const prisma = c.get('prisma');
  const userId:string = c.get('userId');
  try {
   
    const check_result = await prisma.likes.findFirst({
      where:{
          likeById:userId ,
          likeOnId:id
      }
    })
    if(!check_result){
      const like_result = await prisma.likes.create({
        data: {
          likeById: userId, // the user which  liked the blog
          likeOnId: id, // blog id which liked by the user
        },
      });
      return c.json({ message: "blog liked successfully"  , result:like_result}, 200,  );
    }
   else{
    return c.json({message:"user already likes this post"} , 200)
   }
   
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});
// comment to check
blogRouter.post("/comment", async (c: Context) => {
  const body = await c.req.json();
  const userId = c.get('userId');
  const prisma =c.get('prisma');
  try {
    const comment_user = await prisma.comments.create({
      data: {
        commentById: userId,
        commentOnId: body.id,
      }
    });
    console.log("l121")
    const commentupdate = await prisma.comment.create({
      data:{
        commentsId:comment_user.id ,
        comment:body.comment
      }
    })
    console.log("line124")
    return c.json({ message: "commented successfully"  , result:{commentonuser:comment_user.commentOnId ,comment:commentupdate.comment}}, 200, );
  } catch (error) {
    console.log(error)
    return c.json({ error: error }, 400);
  }   
});

// to add category to the blog 

  
  

// find blog that user like
 blogRouter.get('/del' , async (c:Context)=>{
  console.log("line 171")
  const user = c.get('userId');
  const prisma = c.get('prisma');
   const delte = await prisma.blog.deleteMany({
    where:{
      userId:'7f145694-0601-474c-8ab6-66c768210326'
    }
   })
 })
// 



blogRouter.post('/myblogs' , async (c:Context)=>{
  const userId = c.get('userId');
  const prisma = c.get('prisma')
  try {
    const blogs = await prisma.blog.findMany({
      where:{
        userid:userId
      }
    })
    return c.json({message:"all blogs fetched successfully " , blogs} ,200)
    } catch (error) {
      console.log(error);
    return c.json({error:error} ,400)

  }

   
 })
 
 blogRouter.post("/category", async (c) => {
  const body = await c.req.json(); 
  const categoryName:string = body.category;
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());


  try {
    // Check if the category exists, if not, create it
    const category = await prisma.category.upsert({
      where: { Category: categoryName },
      update: {}, // No update, just fetch if exists
      create: { Category: categoryName }, // Create new category if not found
    });
    const addCategory = await prisma.blog.update({
      where: { id: body.blogId },
      data: {
        categories: {
          connect: { id: category.id }, // Connect the existing or newly created category
        },
      },
    });
    
    return c.json({ message: "Category added successfully", result: addCategory }, 200);
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

export default blogRouter;