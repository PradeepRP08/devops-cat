import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    // Status Logic changes
    status: { 
        type: String, 
        enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'], 
        default: 'Applied' 
    },
    
    // Core Application Data
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String },
    
    // Detailed Data
    skills: { type: [String], default: [] },
    education: {
        degree: { type: String },
        college: { type: String },
        year: { type: String }
    },
    experience: {
        level: { type: String, enum: ['fresher', 'experienced'], default: 'fresher' },
        details: { type: String }
    },
    portfolioLinks: {
        github: { type: String },
        linkedin: { type: String },
        website: { type: String }
    },
    currentLocation: { type: String, required: true },
    salaryExpectation: { type: String },
    availability: { type: String, enum: ['Immediate', 'Notice period'], default: 'Immediate' },
    
    appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
