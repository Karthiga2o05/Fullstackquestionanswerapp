import express from 'express';
import { submitAnswer, getUserAnswers, getUserAnswersBySection } from '../controllers/answer.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', submitAnswer);
router.get('/user', getUserAnswers);
router.get('/section/:sectionId', getUserAnswersBySection);

export default router;
