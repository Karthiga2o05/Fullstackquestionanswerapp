import express from 'express';
import { getAllQuestions, getQuestionById } from '../controllers/question.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

export default router;
