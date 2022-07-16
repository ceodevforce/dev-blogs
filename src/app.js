import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

export default app;