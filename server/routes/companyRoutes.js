import express from 'express';
import { 
  updateCompanyProfile, 
  getCompanyProfile, 
  getDashboardStats, 
  postJob, 
  getRecruiterJobs, 
  updateApplicationStatus, 
  getAllApplicants,
  updateJobVisibility,
  deleteJob,
  updateJob
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/multer.js'; // Assumed to exist for logo uploads

const router = express.Router();

router.post('/profile', protect, authorize('recruiter'), upload.single('logo'), updateCompanyProfile);
router.get('/profile', protect, authorize('recruiter'), getCompanyProfile);
router.get('/stats', protect, authorize('recruiter'), getDashboardStats);
router.post('/post-job', protect, authorize('recruiter'), postJob);
router.get('/jobs', protect, authorize('recruiter'), getRecruiterJobs);
router.post('/update-status', protect, authorize('recruiter'), updateApplicationStatus);
router.get('/applicants', protect, authorize('recruiter'), getAllApplicants);
router.post('/update-visibility', protect, authorize('recruiter'), updateJobVisibility);
router.delete('/delete-job/:id', protect, authorize('recruiter'), deleteJob);
router.post('/update-job/:id', protect, authorize('recruiter'), updateJob);

export default router;
