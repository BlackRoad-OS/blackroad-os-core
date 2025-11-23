import express from 'express';
import health from './routes/health';
import ledgerRouter from './routes/ledger';
import systemRouter from './routes/systemRoutes';

const app = express();

app.use(express.json());

app.use(health);
app.use(systemRouter);
app.use('/ledger', ledgerRouter);

const port = Number(process.env.PORT) || 8080;

app.listen(port, '0.0.0.0', () => {
  console.log(`[blackroad-os-core] listening on http://0.0.0.0:${port}`);
});

export default app;
