import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from "hono/jwt"
import { createBlogInput, updateBlogInput } from "@rathinkiran/medium-common2";


export const blogRouter=new Hono<{
    Bindings:{
      DATABASE_URL:string;
      JWT_SECRET:string;
    },
    Variables:{
        userId:string
    }
  }>();

  blogRouter.use("/*", async (c,next)=>{
    const authHeader = c.req.header("authorization") || "";

    try{
        const user = await verify(authHeader,c.env.JWT_SECRET);
    if(user){
        c.set("userId",user.id);
       await next();
    } 
    else{
        c.status(403);
        return c.json({
            message:"You are not logged in"
        })
    }

    }catch(e){
        c.status(403);
        return c.json({
            message:"You are not logged in"
        })
    }
    
    
  })
  
blogRouter.post('/', async (c) => {
    const body =await c.req.json();
    const {success} =createBlogInput.safeParse(body);
    if(!success){
        c.status(403);
        return c.json({
            message:"your inputs are not correct"
        })
    }
    const authorId=c.get("userId")
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const blog=await prisma.blog.create({
    data:{
        title:body.title,
        content:body.content,
        authorId:Number(authorId)
    }
})
    return c.json({
        id:blog.id
    })
  })
  


  blogRouter.put('/', async (c) => {
    const body =await c.req.json();
    const {success} = updateBlogInput.safeParse(body)
    if(!success){
        c.status(403);
        return c.json({
            message:"your inputs are not correct"
        })
    }
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  const blog=await prisma.blog.update({
    where:{
        id:body.id
    },
      data:{
          title:body.title,
          content:body.content
      }
  })
      return c.json({
          id:blog.id
      })
    return c.text('Hello Hono!')
  })

  blogRouter.get('/bulk',async (c) => {
    const body =await c.req.json();
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const blogs=await prisma.blog.findMany();
    
  return c.json({
    blogs
  })
  
  })


  
  blogRouter.get('/:id', async (c) => {
    const id = c.req.param("id");
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
  try{
    const blog=await prisma.blog.findFirst({
        where:{
            id:Number(id)
        }
    })
        return c.json({
            blog
        })
      return c.text('Hello Hono!')

  }catch(e){
    c.status(411);
    return c.json({
        message:"Error while fetching blog post"
    })
  }
    return c.text('Hello Hono2!')
  })
  


  