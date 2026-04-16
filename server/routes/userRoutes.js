import express from 'express';
import { updateUserProfile, applyForJob, getUserApplications, getJobs, getJobById, saveJob } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/multer.js'; // Assumed to exist for resume uploads

const router = express.Router();

router.post('/profile', protect, authorize('user'), upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), updateUserProfile);
router.post('/apply', protect, authorize('user'), upload.single('resume'), applyForJob);
router.get('/applications', protect, authorize('user'), getUserApplications);
router.get('/jobs', getJobs); // Publicly accessible with query params
router.get('/job/:id', getJobById); // New consolidated route
router.post('/save-job', protect, authorize('user'), saveJob);

export default router;
