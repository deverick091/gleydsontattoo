import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env';
import { corsConfig } from './config/cors';
import routes from './routes/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);
app.use(errorHandler);

export { app };
