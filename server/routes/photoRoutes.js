import express from 'express';
import multer from 'multer';
import path from 'path';
import { requireUser } from '../middleware/auth.js';
import { getAll, getOne, create, remove } from '../controllers/photoController.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`;
    cb(null, safeName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, WebP, and GIF files are allowed'));
    }
    cb(null, true);
  }
});

const router = express.Router();
router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', requireUser, upload.single('photo'), create);
router.delete('/:id', requireUser, remove);

export default router;
