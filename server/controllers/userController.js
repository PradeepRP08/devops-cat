import User from "../models/User.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import { uploadFromBuffer } from "../config/cloudinary.js";

/**
 * @desc    Updates the profile of the currently logged-in candidate
 * @route   POST /api/users/profile
 * @access  Private (Candidate only)
 */
export const updateUserProfile = async (req, res) => {
    try {
        const { bio, phone, location, education, experience, skills, links, preferences } = req.body;
        const userId = req.user._id;

        const updateData = {};
        if (bio) updateData.bio = bio;
        if (phone) updateData.phone = phone;
        if (location) updateData.location = location;
        if (education) updateData.education = JSON.parse(education);
        if (experience) updateData.experience = JSON.parse(experience);
        if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',');
        if (links) updateData.links = JSON.parse(links);
        if (preferences) updateData.preferences = JSON.parse(preferences);
        
        // Handle file uploads
        if (req.files) {
            if (req.files.resume) {
                updateData.resume = await uploadFromBuffer(
                    req.files.resume[0].buffer, 
                    'resumes', 
                    req.files.resume[0].originalname
                );
            }
            if (req.files.image) {
                updateData.image = await uploadFromBuffer(
                    req.files.image[0].buffer, 
                    'avatars', 
                    req.files.image[0].originalname
                );
            }
        }

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Processes a new job application for the logged-in candidate
 * @route   POST /api/users/apply
 * @access  Private (Candidate only)
 */
export const applyForJob = async (req, res) => {
    try {
        const { jobId, fullName, email, phone, coverLetter, skills, education, experience, portfolioLinks, currentLocation, salaryExpectation, availability } = req.body;
        const userId = req.user._id;

        const existingApplication = await JobApplication.findOne({ 
            jobId, 
            $or: [ { email }, { phone } ] 
        });
        if (existingApplication) return res.status(400).json({ success: false, message: "Application already exists with this email or phone number" });

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // Handle Resume Upload
        let resumeUrl = '';
        if (req.file) {
            console.log(`[APPLY] Resume file received: ${req.file.originalname}`);
            resumeUrl = await uploadFromBuffer(
                req.file.buffer, 
                'applications', 
                req.file.originalname
            );
        } else {
            // Check if user has an existing resume in their profile if not provided
            const user = await User.findById(userId);
            if (!user.resume) return res.status(400).json({ success: false, message: "Resume is required" });
            console.log(`[APPLY] Using existing resume: ${user.resume}`);
            resumeUrl = user.resume;
        }

        const application = await JobApplication.create({
            jobId,
            userId,
            companyId: job.companyId,
            status: 'Applied',
            fullName,
            email,
            phone,
            resume: resumeUrl,
            coverLetter,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',') : []),
            education: typeof education === 'string' ? JSON.parse(education) : education,
            experience: typeof experience === 'string' ? JSON.parse(experience) : experience,
            portfolioLinks: typeof portfolioLinks === 'string' ? JSON.parse(portfolioLinks) : portfolioLinks,
            currentLocation,
            salaryExpectation,
            availability
        });

        console.log(`[APPLY] Application saved. Resume path in DB: ${application.resume}`);

        res.json({ success: true, message: "Application submitted successfully", application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches all job applications submitted by the current candidate
 * @route   GET /api/users/applications
 * @access  Private (Candidate only)
 */
export const getUserApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await JobApplication.find({ userId })
            .populate({
                path: 'jobId',
                select: 'title location salaryRange jobType companyName companyLogo'
            })
            .sort({ createdAt: -1 });

        res.json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches all available jobs with optional sorting and filtering
 * @route   GET /api/users/jobs
 * @access  Public
 */
export const getJobs = async (req, res) => {
    try {
        const { search, location, jobType, level, experience, salaryMin } = req.query;
        
        let query = { visible: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skillsRequired: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (location) query.location = { $regex: location, $options: 'i' };
        if (jobType) query.jobType = jobType;
        if (level) query.level = level;
        if (experience) query.experience = experience;

        const jobs = await Job.find(query).sort({ createdAt: -1 });

        res.json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches detailed information for a single job by its ID
 * @route   GET /api/users/job/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id).populate({
            path: 'companyId',
            select: '-password'
        });

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        res.json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Toggles a job in the candidate's saved/bookmarked list
 * @route   POST /api/users/save-job
 * @access  Private (Candidate only)
 */
export const saveJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (user.savedJobs.includes(jobId)) {
            user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
            await user.save();
            return res.json({ success: true, message: "Job removed from saved jobs" });
        } else {
            user.savedJobs.push(jobId);
            await user.save();
            return res.json({ success: true, message: "Job saved successfully" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
