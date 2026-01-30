import express from 'express';
import {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getDashboardStats,
} from '../controllers/admin.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect, adminOnly);

router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.get('/dashboard', getDashboardStats);

export default router;
