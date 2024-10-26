import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}


const app = new Hono<{ Bindings: Bindings }>()

app.get("/api/posts/:slug/comments", async (c) => {
  const { slug } = c.req.param();

  const db = await c.env.DB

  const { results } = await db.prepare(
    `
    select * from comments where post_slug = ?
  `,
  )
    .bind(slug)
    .all();
  return c.json(results);
});

export default app
