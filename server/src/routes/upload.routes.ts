import { Router } from 'express'
import multer from 'multer'
import { uploadSingle, uploadMultiple, removeImage } from '../controllers/upload.controller'
import { authenticate } from '../middleware/auth'
import { isAdmin } from '../middleware/role'

const storage = multer.memoryStorage()

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

const router = Router()

router.use(authenticate, isAdmin)

router.post('/single', upload.single('image'), uploadSingle)
router.post('/multiple', upload.array('images', 10), uploadMultiple)
router.delete('/', removeImage)

export default router
