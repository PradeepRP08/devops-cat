import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    // Detailed Fields
    category: { type: String, required: true },
    salaryRange: { type: String },
    experience: { type: String },
    jobType: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Remote'], default: 'Full-time' },
    skillsRequired: [String],
    openings: { type: Number, default: 1 },
    deadline: { type: Date },
    
    // Elaborated Sections
    responsibilities: { type: String },
    qualifications: {
        required: [String],
        preferred: [String]
    },
    perks: [String],
    workMode: { type: String, enum: ['Work from Office', 'Work from Home', 'Hybrid'], default: 'Work from Office' },
    
    visible: { type: Boolean, default: true },
    postedDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;
