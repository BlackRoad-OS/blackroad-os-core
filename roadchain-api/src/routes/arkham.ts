/**
 * Arkham Intelligence API Routes for RoadChain
 */

import { Router } from 'express';
import { getArkham, enrichAddress, getWalletAnalytics } from '../services/arkham.js';

const router = Router();

/**
 * GET /api/arkham/entity/:nameOrUsername
 * Get entity information by name or username
 */
router.get('/entity/:nameOrUsername', async (req, res) => {
  try {
    const { nameOrUsername } = req.params;
    const arkham = getArkham();
    const entity = await arkham.getEntity(nameOrUsername);

    res.json({
      success: true,
      entity,
    });
  } catch (error: any) {
    res.status(error.message.includes('404') ? 404 : 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/address/:address
 * Get intelligence for a specific address
 */
router.get('/address/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const arkham = getArkham();
    const intelligence = await arkham.getAddress(address);

    res.json({
      success: true,
      address,
      intelligence,
    });
  } catch (error: any) {
    res.status(error.message.includes('404') ? 404 : 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/portfolio/:address
 * Get portfolio for an address
 */
router.get('/portfolio/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const arkham = getArkham();
    const portfolio = await arkham.getPortfolio(address);

    res.json({
      success: true,
      address,
      portfolio,
    });
  } catch (error: any) {
    res.status(error.message.includes('404') ? 404 : 500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/transfers/:address
 * Get transfers for an address
 */
router.get('/transfers/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const chain = req.query.chain as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

    const arkham = getArkham();
    const transfers = await arkham.getTransfers(address, { chain, limit, offset });

    res.json({
      success: true,
      address,
      transfers,
      pagination: {
        limit,
        offset,
        total: transfers.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/labels/:address
 * Get labels for an address
 */
router.get('/labels/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const arkham = getArkham();
    const labels = await arkham.getLabels(address);

    res.json({
      success: true,
      address,
      labels,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/search?q=query
 * Search for entities, addresses, or transactions
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const arkham = getArkham();
    const results = await arkham.search(query);

    res.json({
      success: true,
      query,
      results,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/enrich/:address
 * Get enriched address data (labels + entity + portfolio)
 */
router.get('/enrich/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const enriched = await enrichAddress(address);

    res.json({
      success: true,
      ...enriched,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/arkham/analytics/:address
 * Get comprehensive wallet analytics
 */
router.get('/analytics/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const analytics = await getWalletAnalytics(address);

    res.json({
      success: true,
      ...analytics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
