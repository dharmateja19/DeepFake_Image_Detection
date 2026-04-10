import {Router} from 'express'
import upload from '../middleware/uploadMiddleware.js'
import { uploadImage } from '../controllers/uploadController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = Router()

router.use(authMiddleware)

router.post('/upload',upload.single('image'), uploadImage)

export default router