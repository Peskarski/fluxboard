import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './auth/routes.js';

export const app = express();

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRouter);
