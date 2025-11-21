import express from 'express';
import ledgerRouter from './routes/ledger';
import { PORT } from './config/env';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'core' });
});

app.use('/ledger', ledgerRouter);

app.listen(PORT, () => {
  console.log(`BlackRoad OS Core service listening on port ${PORT}`);
});

export default app;
