// this router will handle all the activites  done by user eg : like the blog  , comment on the blog ,
import { PrismaClient } from "@prisma/client/edge";
import { Context, Hono } from "hono";
import { withAccelerate } from "@prisma/extension-accelerate";

const actRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
// follow route
actRouter.post("/follow/:id", async (c: Context) => {
  const prisma = c.get("prisma");
  const id = c.req.param("id");
  const userId = c.get("userId");
  try {
    const check_if_follow = await prisma.follows.findFirst({
      where: {
        followingId: id,
      },
    });
    if (check_if_follow) {
      return c.json({ error: "you already following user" }, 200);
    } else {
      try {
        const follow_user = await prisma.follows.create({
          data: {
            followerId: userId,
            followingId: id,
          },
        });
        return c.json({ message: "following action successful" }, 200);
      } catch (error) {
        return c.json({ error: error }, 400);
      }
    }
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

// unfollow route
actRouter.post("/unfollow/:id", async (c: Context) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
 
  const id = c.req.param("id");
  const userId = c.get("userId");
  try {
    const check_if_follow = await prisma.follows.findFirst({
      where: {
       followerId:userId ,
       followingId:id
      },
    });
    if (!check_if_follow) {
      return c.json({ error: "you already following user" }, 400);
    } else {
      try {
        const follow_user = await prisma.follows.delete({
         where:{
          followerId_followingId:{
            followerId:userId ,
            followingId:id
          }
         }
        });
        return c.json({ message: "unfollowing action successful" }, 200);
      } catch (error) {
        return c.json({ error: error }, 400);
      }
    }
  } catch (error) {
    console.log(error)
    return c.json({ error: error }, 400);
  }
});

// like category : category choose by user
actRouter.post("/:category", async (c: Context) => {
  const userId = c.get("userId");
  const category = c.req.param('category');
  const primsa = c.get('prisma');
  try {
    const category_result = await primsa.user.update({
      where: {
        id: userId,
      },
      data: {
        categories: {
          connect: {
            Category:category
          },
        },
      },
    });
    return c.json({ message: "category added successfully" }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ error: error }, 400);
  }
});

// suggesting user to follow c  cording to thier categories
actRouter.get("/suggest_user", async (c: Context) => {
  const userId = c.get("userId");
  const primsa = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const ulcu = await primsa.user.findMany({
      take: 10,
      where: {
        id: userId,
      },
      select: {
        categories: {
          select: {
            blogs: {
              select: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const uniqueUsers:any = [];
    const userSet = new Set();
    ulcu.forEach((c)=>{
        c.categories.forEach((b)=>{
            b.blogs.forEach((a) => {
                if (!userSet.has(a.user.id)) {
                    userSet.add(a.user.id);
                    uniqueUsers.push(a.user.id);
                  }
            });
        })

    })
    return c.json({ message: "found successfully", result: uniqueUsers }, 200);
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

actRouter.get("/get_blog_by_cat", async (c: Context) => {
  const userId = c.get("userId");
  const primsa = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const find_blog = await primsa.user.findMany({
        take:10 ,
      where: {
        id: userId,
      },
      select: {
        categories: {
          select: {
            id: true,
            blogs: true,
          },
        },
      },
    });
    // Remove duplicate users (if multiple blogs by the same user)
    const uniqueUsers:any= [];
    const userSet = new Set();
    find_blog.forEach((category) => {
      category.categories.forEach((blog) => {
        if (!userSet.has(blog.id)) {
            userSet.add(blog.id);
            uniqueUsers.push(blog);
          }
      });
    });
    return c.json({message:"FETCHED SUCCESSFULLY" ,result:uniqueUsers} , 200)
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});


export default actRouter;
