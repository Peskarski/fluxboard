import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

export type JwtPayload = {
  userId: string;
};

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
