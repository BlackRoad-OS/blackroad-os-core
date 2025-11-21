import { Router } from 'express';

const ledgerRouter = Router();

ledgerRouter.get('/', (_req, res) => {
  res.status(501).json({ message: 'Ledger route placeholder' });
});

export default ledgerRouter;
