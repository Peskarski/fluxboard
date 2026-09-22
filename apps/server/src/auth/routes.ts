import { Router } from 'express';
import type { Response } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { AuthCredentials, AuthUser } from '@fluxboard/shared';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { hashPassword, verifyPassword } from './password.js';
import { signJwt } from './jwt.js';
import { requireAuth } from './middleware.js';
import { AUTH_COOKIE_NAME } from './constants.js';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
}) satisfies z.ZodType<AuthCredentials>;

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
    res.status(201).json({ user } satisfies { user: AuthUser });
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
  res.json({ user: { id: user.id, email: user.email } } satisfies { user: AuthUser });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME);
  res.status(204).send();
});

authRouter.get('/me', requireAuth, async (req, res) => {
  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.id, req.userId!));

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user } satisfies { user: AuthUser });
});
