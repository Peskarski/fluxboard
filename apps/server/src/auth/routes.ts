import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { hashPassword, verifyPassword } from './password.js';
import { signJwt } from './jwt.js';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const AUTH_COOKIE_NAME = 'fluxboard_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

function isUniqueViolation(err: unknown): boolean {
  const code = (err as { cause?: { code?: string }; code?: string })?.cause?.code ?? (err as { code?: string })?.code;
  return code === '23505';
}

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;

  try {
    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email });

    const token = signJwt({ userId: user.id });
    setAuthCookie(res, token);
    res.status(201).json({ user });
  } catch (err) {
    if (isUniqueViolation(err)) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    throw err;
  }
});

authRouter.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = signJwt({ userId: user.id });
  setAuthCookie(res, token);
  res.json({ user: { id: user.id, email: user.email } });
});
