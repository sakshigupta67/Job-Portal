import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
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
import { protectCompany } from '../middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/:jobId/apply', applyToJob);
router.get('/me/applications', getApplicationsForUser);
router.post('/company/create', protectCompany, createJob);
router.get('/company/my-jobs', protectCompany, getCompanyJobs);
router.patch('/company/:id/visibility', protectCompany, updateJobVisibility);
router.get('/company/applications', protectCompany, getApplicationsForCompany);
router.patch('/company/applications/status', protectCompany, changeApplicationStatus);

export default router;