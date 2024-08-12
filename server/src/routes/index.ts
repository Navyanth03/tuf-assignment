import express, { Router } from 'express';
import adminRouter from './admin';
import bannerRouter from './banner';

const router: Router = express.Router();

router.use('/admin', adminRouter);
router.use('/banner', bannerRouter);

export default router;
