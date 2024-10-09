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
actRouter.get("/follow/:id", async (c: Context) => {
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
actRouter.get("/unfollow/:id", async (c: Context) => {
  const prisma = c.get("prisma");
  const id = c.req.param("id");
  const userId = c.get("userId");
  try {
    const check_if_follow = await prisma.follows.findFirst({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: id,
        },
      },
    });
    if (!check_if_follow) {
      return c.json({ error: "you already following user" }, 400);
    } else {
      try {
        const follow_user = await prisma.follows.delete({
          where: {
            followerId_followingId: {
              followerId: userId,
              followingId: id,
            },
          },
        });
        return c.json({ message: "unfollowing action successful" }, 200);
      } catch (error) {
        return c.json({ error: error }, 400);
      }
    }
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

// like category : category choose by user
actRouter.post("/category", async (c: Context) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const prisma = c.get("prisma");
  try {
    const category_result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        categories: {
          connect: {
            id: body.categoryId,
          },
        },
      },
    });
    return c.json({ message: "category added successfully" }, 200);
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

// suggesting user to follow ccording to thier categories
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
                userid: true,
              },
            },
          },
        },
      },
    });
    const uniqueUsers = [];
    const userSet = new Set();
    

    return c.json({ message: "found successfully", result: ulcu }, 200);
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
    const uniqueUsers = [];
    const userSet = new Set();
    find_blog.forEach((category) => {
      category.categories.forEach((blog) => {
        if (!userSet.has(blog.id)) {
          userSet.add(blog.id);
          uniqueUsers.push(blog);
        }
      });
    });
  } catch (error) {
    return c.json({ error: error }, 400);
  }
});

export default actRouter;
