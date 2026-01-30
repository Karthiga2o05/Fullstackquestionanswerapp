import express from 'express';
import { submitAnswer, getUserAnswers, getMyAnswers } from '../controllers/answer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', submitAnswer);
router.get('/', getMyAnswers);
router.get('/:userId', getUserAnswers);

export default router;
