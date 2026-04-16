import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { uploadFromBuffer } from "../config/cloudinary.js";
import { calculateSkillMatch } from "../utils/aiMatch.js";

/**
 * @desc    Updates or creates the professional profile for a company
 * @route   POST /api/company/profile
 * @access  Private (Recruiter only)
 */
export const updateCompanyProfile = async (req, res) => {
    try {
        const { name, description, website, location, industry } = req.body;
        const recruiterId = req.user._id;

        let company = await Company.findOne({ createdBy: recruiterId });

        if (company) {
            // Update
            company.name = name || company.name;
            company.description = description || company.description;
            company.website = website || company.website;
            company.location = location || company.location;
            company.industry = industry || company.industry;
            if (req.file) {
                company.logo = await uploadFromBuffer(
                    req.file.buffer, 
                    'company_logos', 
                    req.file.originalname
                );
            }
            
            await company.save();
            res.json({ success: true, message: "Company profile updated", company });
        } else {
            // Create
            company = await Company.create({
                name,
                description,
                website,
                location,
                industry,
                logo: req.file ? await uploadFromBuffer(req.file.buffer, 'company_logos', req.file.originalname) : "https://via.placeholder.com/150",
                createdBy: recruiterId
            });
            
            // Link company to user
            await User.findByIdAndUpdate(recruiterId, { company: company._id });
            
            res.status(201).json({ success: true, message: "Company profile created", company });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches the profile for the currently logged-in recruiter's company
 * @route   GET /api/company/profile
 * @access  Private (Recruiter only)
 */
export const getCompanyProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) return res.json({ success: true, company: null });
        res.json({ success: true, company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches high-level statistics for the recruiter dashboard
 * @route   GET /api/company/stats
 * @access  Private (Recruiter only)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) {
            return res.json({ success: true, stats: { totalJobs: 0, totalApplicants: 0, shortlistedCandidates: 0, activeJobs: 0 } });
        }

        const stats = {
            totalJobs: await Job.countDocuments({ companyId: company._id }),
            totalApplicants: await JobApplication.countDocuments({ companyId: company._id }),
            shortlistedCandidates: await JobApplication.countDocuments({ companyId: company._id, status: 'Shortlisted' }),
            activeJobs: await Job.countDocuments({ companyId: company._id, visible: true })
        };

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Posts a new job opportunity on behalf of the company
 * @route   POST /api/company/post-job
 * @access  Private (Recruiter only)
 */
export const postJob = async (req, res) => {
    try {
        const { title, description, location, category, salaryRange, experience, jobType, skillsRequired, openings, deadline, responsibilities, qualifications, perks, workMode } = req.body;
        
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) return res.status(404).json({ success: false, message: "Create company profile first" });

        const newJob = new Job({
            title, description, location, category,
            companyName: company.name,
            companyLogo: company.logo,
            companyId: company._id,
            salaryRange, experience, jobType, 
            skillsRequired: (Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',')).map(s => s.trim()).filter(s => s !== ""),
            openings, deadline, responsibilities, qualifications, perks, workMode
        });

        await newJob.save();
        res.json({ success: true, message: "Job posted successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches all jobs posted by the current recruiter
 * @route   GET /api/company/jobs
 * @access  Private (Recruiter only)
 */
export const getRecruiterJobs = async (req, res) => {
    try {
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) return res.json({ success: true, jobs: [] });

        const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });
        
        const jobsWithCount = await Promise.all(jobs.map(async (job) => {
            const count = await JobApplication.countDocuments({ jobId: job._id });
            return { ...job.toObject(), applicantsCount: count };
        }));

        res.json({ success: true, jobs: jobsWithCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Updates the status of a job application (Shortlist, Hire, etc.)
 * @route   POST /api/company/update-status
 * @access  Private (Recruiter only)
 */
export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId, status } = req.body;
        const application = await JobApplication.findById(applicationId);
        
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });

        application.status = status;
        await application.save();

        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Fetches all candidates who have applied for the company's jobs
 * @route   GET /api/company/applicants
 * @access  Private (Recruiter only)
 */
export const getAllApplicants = async (req, res) => {
    try {
        const company = await Company.findOne({ createdBy: req.user._id });
        if (!company) return res.json({ success: true, applications: [] });

        const applications = await JobApplication.find({ companyId: company._id })
            .populate('jobId', 'title skillsRequired')
            .populate('userId', 'name email phone links skills experience education resume')
            .sort({ createdAt: -1 });

        const applicationsWithScore = applications.map(app => {
            const score = calculateSkillMatch(app.userId, app.jobId);
            return { ...app.toObject(), matchScore: score };
        });

        res.json({ success: true, applications: applicationsWithScore });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Toggles the visibility of a job posting on the public portal
 */
export const updateJobVisibility = async (req, res) => {
    try {
        const { id } = req.body;
        const job = await Job.findById(id);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        job.visible = !job.visible;
        await job.save();

        res.json({ success: true, message: `Job is now ${job.visible ? 'visible' : 'hidden'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Permanently deletes a job posting and its associated applications
 */
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await Job.findById(id);

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        // Delete associated applications
        await JobApplication.deleteMany({ jobId: id });
        // Delete job
        await Job.findByIdAndDelete(id);

        res.json({ success: true, message: "Job and its applications deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @desc    Updates the details of an existing job posting
 */
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const jobData = req.body;

        const job = await Job.findByIdAndUpdate(id, jobData, { new: true });

        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        res.json({ success: true, message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
