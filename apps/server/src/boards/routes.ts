import { Router } from 'express';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import type { Board, CreateBoardInput } from '@fluxboard/shared';
import { db } from '../db/client.js';
import { boards } from '../db/schema.js';
import { requireAuth } from '../auth/middleware.js';

const createBoardSchema = z.object({
  name: z.string().trim().min(1).max(100),
}) satisfies z.ZodType<CreateBoardInput>;

const boardIdSchema = z.string().uuid();

function toBoard(row: typeof boards.$inferSelect): Board {
  return {
    id: row.id,
    name: row.name,
    ownerId: row.ownerId,
    createdAt: row.createdAt.toISOString(),
  };
}

export const boardsRouter = Router();

boardsRouter.use(requireAuth);

boardsRouter.get('/', async (req, res) => {
  const rows = await db
    .select()
    .from(boards)
    .where(eq(boards.ownerId, req.userId!))
    .orderBy(desc(boards.createdAt));

  res.json({ boards: rows.map(toBoard) } satisfies { boards: Board[] });
});

boardsRouter.post('/', async (req, res) => {
  const parsed = createBoardSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const [row] = await db
    .insert(boards)
    .values({ name: parsed.data.name, ownerId: req.userId! })
    .returning();

  res.status(201).json({ board: toBoard(row) } satisfies { board: Board });
});

boardsRouter.delete('/:id', async (req, res) => {
  const parsedId = boardIdSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }

  const deleted = await db
    .delete(boards)
    .where(and(eq(boards.id, parsedId.data), eq(boards.ownerId, req.userId!)))
    .returning({ id: boards.id });

  if (deleted.length === 0) {
    res.status(404).json({ error: 'Board not found' });
    return;
  }

  res.status(204).send();
});
