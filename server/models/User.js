import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Custom JWT Auth
    role: { type: String, enum: ['user', 'recruiter'], default: 'user' },
    image: { type: String },
    bio: { type: String },
    
    // User Specific Fields
    phone: { type: String },
    location: { type: String },
    education: [
        {
            institution: String,
            degree: String,
            startYear: Number,
            endYear: Number
        }
    ],
    experience: [
        {
            company: String,
            role: String,
            duration: String,
            description: String
        }
    ],
    skills: [String],
    resume: { type: String },
    links: {
        github: String,
        linkedin: String,
        portfolio: String
    },
    preferences: {
        role: String,
        location: String,
        expectedSalary: Number
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],

    // Recruiter Specific Fields (Company ref managed via role)
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

    date: { type: Date, default: Date.now }
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
