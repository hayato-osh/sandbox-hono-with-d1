import { vValidator } from '@hono/valibot-validator'
import { Hono } from 'hono'
import { object, string } from 'valibot'

type Bindings = {
  DB: D1Database
}

const getParamSchema = object({
  slug: string(),
})

const postParamSchema = object({
  slug: string(),
})
const postJsonSchema = object({
  author: string('著者型エラー'),
  body: string(),
})

const app = new Hono<{ Bindings: Bindings }>().get("/:slug/comments", vValidator('param',getParamSchema), async (c) => {
  const { slug } = c.req.valid("param");

  const db = await c.env.DB

  const { results } = await db.prepare(
    `
    select * from comments where post_slug = ?
  `,
  )
    .bind(slug)
    .all();
  return c.json(results);
})
.post("/:slug/comments", vValidator('param', postParamSchema), vValidator('json', postJsonSchema), async (c) => {
  const { slug } = c.req.valid('param');
  const { author, body } = c.req.valid('json');

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
