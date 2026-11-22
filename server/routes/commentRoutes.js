import express from 'express';
import { requireUser } from '../middleware/auth.js';
import { create } from '../controllers/commentController.js';

const router = express.Router();
router.post('/:id/comments', requireUser, create);

export default router;
