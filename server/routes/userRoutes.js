import {Router} from 'express'
import getUser from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router();

router.get('/me', authMiddleware,  getUser);

export default router