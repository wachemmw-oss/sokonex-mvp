import express from 'express';
import * as homeController from '../controllers/homeController';

const router = express.Router();

router.get('/flash', homeController.getHomeFlash);
router.get('/exclusive', homeController.getHomeExclusive);
router.get('/trending', homeController.getHomeTrending);
router.get('/mode', homeController.getHomeMode);
router.get('/beaute', homeController.getHomeBeaute);

export default router;
