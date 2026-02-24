import express from 'express';
import * as homeController from '../controllers/homeController';

const router = express.Router();

router.get('/flash', homeController.getListFlash);
router.get('/exclusive', homeController.getListExclusive);
router.get('/trending', homeController.getListTrending);
router.get('/mode', homeController.getListMode);
router.get('/beaute', homeController.getListBeaute);

export default router;
