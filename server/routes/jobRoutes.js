import express from 'express';
import upload from '../config/multer.js';
import {
  applyToJob,
  changeApplicationStatus,
  createJob,
  getApplicationsForCompany,
  getApplicationsForUser,
  getCompanyJobs,
  getJobById,
  getJobs,
  updateJobVisibility,
  uploadResume,
} from '../controllers/jobController.js';
import { protectCompany, protectUser } from '../middlewares/auth.js';

const router = express.Router();

// Public routes — must come before /:id to avoid shadowing
router.get('/', getJobs);

// User-specific routes — defined BEFORE /:id so Express does not swallow them
router.get('/me/applications', protectUser, getApplicationsForUser);
router.post('/upload-resume', upload.single('resume'), protectUser, uploadResume);

// Company-protected routes
router.post('/company/create', protectCompany, createJob);
router.get('/company/my-jobs', protectCompany, getCompanyJobs);
router.patch('/company/:id/visibility', protectCompany, updateJobVisibility);
router.get('/company/applications', protectCompany, getApplicationsForCompany);
router.patch('/company/applications/status', protectCompany, changeApplicationStatus);

// Dynamic segment — must come AFTER all static paths
router.get('/:id', getJobById);
router.post('/:jobId/apply', protectUser, applyToJob);

export default router;
