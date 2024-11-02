import { Hono } from "hono";
import posts from './posts'

const app = new Hono();

app.route('/posts', posts)

export default app;