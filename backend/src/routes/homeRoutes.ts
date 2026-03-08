import express from 'express';
import * as homeController from '../controllers/homeController';
import { setCache } from '../middleware/cacheMiddleware';

const router = express.Router();

router.get('/flash', setCache(300, 600), homeController.getHomeFlash);
router.get('/exclusive', setCache(300, 600), homeController.getHomeExclusive);
router.get('/trending', setCache(300, 600), homeController.getHomeTrending);
router.get('/mode', setCache(300, 600), homeController.getHomeMode);
router.get('/beaute', setCache(300, 600), homeController.getHomeBeaute);

export default router;
