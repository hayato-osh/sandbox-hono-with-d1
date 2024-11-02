import { Hono } from "hono";
import posts from './posts'
import { hc } from "hono/client";

const app = new Hono();

const routes = app.route('/posts', posts)

export default routes;

