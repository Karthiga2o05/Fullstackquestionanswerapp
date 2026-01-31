import express from 'express';
import { getAllSections, getSectionById } from '../controllers/section.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getAllSections);
router.get('/:id', getSectionById);

export default router;
