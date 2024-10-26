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

app.post("/api/posts/:slug/comments", async (c) => {
  const { slug } = c.req.param();
  const { author, body } = await c.req.json();

  if (!author) return c.text("Missing author value for new comment");
  if (!body) return c.text("Missing body value for new comment");

  const db = await c.env.DB

  const { success } = await db.prepare(
    `
    insert into comments (author, body, post_slug) values (?, ?, ?)
  `,
  )
    .bind(author, body, slug)
    .run();

  if (success) {
    c.status(201);
    return c.text("Created");
  } else {
    c.status(500);
    return c.text("Something went wrong");
  }
});

export default app
