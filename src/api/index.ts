import { Hono } from "hono";
import v1 from './v1'
import { hc } from "hono/client";

const app = new Hono();

const routes = app.route('/api/v1', v1)

export default routes;

export type AppType = typeof routes;

export const client = hc<AppType>("http:localhost:8787");
