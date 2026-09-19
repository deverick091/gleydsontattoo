import rateLimit from 'express-rate-limit';
import { RateLimitError } from '../helpers/errors.js';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => next(new RateLimitError()),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res, next) => next(new RateLimitError()),
});
