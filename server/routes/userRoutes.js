import express from 'express';
import upload from '../config/multer.js';
import { getUserById, updateResume } from '../controllers/userController.js';
import { protectUser } from '../middlewares/auth.js';

const router = express.Router();

// Public — job seekers need their own profile to be readable (e.g. ApplyJob page fetches it)
router.get('/:id', getUserById);

// Protected — only the authenticated user may update their own resume
router.patch('/:id/resume', protectUser, upload.single('resume'), updateResume);

export default router;
