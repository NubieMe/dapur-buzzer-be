import { Router } from 'express';
import * as controller from '../controller/index';
import upload from '../middleware/upload';

const router = Router();

router.get('/influencer', controller.getAll)
router.get('/influencer/:id', controller.getOne)
router.post('/influencer', upload({}).single('image'), controller.create)
router.patch('/influencer/:id', upload({}).single('image'), controller.update)
router.delete('/influencer/:id', controller.destroy)

router.get('/', controller.forwarder)

export default router
