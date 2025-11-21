import express from 'express';
import ledgerRouter from './routes/ledger';
import { PORT } from './config/env';
import packageJson from '../package.json' assert { type: 'json' };

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'core' });
});

app.get('/version', (_req, res) => {
  const { version } = packageJson;
  res.json({ version, service: 'core' });
});

app.use('/ledger', ledgerRouter);

app.set('port', PORT);

export default app;
