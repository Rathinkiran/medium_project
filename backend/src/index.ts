import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {decode,sign,verify} from "hono/jwt"
import { userRouter } from './routes/user'
import {blogRouter} from './routes/blog'


const app = new Hono<{
  Bindings:{
    DATABASE_URL:string;
    JWT_SECRET:string;
  }
}>()

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);


export default app

//postgresql://rathinvj07:WPVxBJ6HhR8A@ep-yellow-paper-25981505-pooler.us-east-2.aws.neon.tech/test?sslmode=require

//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZTNhMTk2NGMtNzExMi00NjI1LWJjZDUtZmQ1ZTAzNjBhNmU4IiwidGVuYW50X2lkIjoiN2I5Y2UxMzQyMjIxM2M0YTVhOTg3MDc1NjgzOTE1MzEzMTU4MDY0ZWUwY2JhYTQ5YzM3YzYxMzNkMjc3MmRiOCIsImludGVybmFsX3NlY3JldCI6Ijc2MGQ2NWE1LWJiOTYtNGI3Mi05ZGZlLTc0YmZkNDZiMmNhNSJ9.tgDxtKgHyLtwHgttCZ7BLBflQKB2dRs-1GPCvXF5k7I"