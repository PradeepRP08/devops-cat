import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import "./config/loadEnv.js";
import "./config/instrument.js";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import path from "node:path";
import fs from "fs";
import Job from './models/Job.js'
import Company from './models/Company.js'
import User from './models/User.js'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const app = express()
const uploadsDir = path.join(process.cwd(), 'uploads')
const subDirs = ['applications', 'resumes', 'company_logos', 'avatars']
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir)
}
subDirs.forEach(dir => {
    const fullPath = path.join(uploadsDir, dir)
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
    }
})

// Env Validation
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
requiredEnv.forEach(env => {
    if (!process.env[env]) {
        console.error(`CRITICAL: Missing environment variable ${env}`);
    }
});

try {
  await connectDB()
  console.log("MongoDB connected")
} catch (err) {
  console.error("DB connection failed:", err)
  process.exit(1)
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('API Working'))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("MY first sentry error mamey");
})
app.get('/api/test', (req, res) => res.json({ success: true, message: "API is active and reachable" }))
app.get('/api/seed-fresh', async (req, res) => {
    try {
        console.log("Starting nuclear cleanup and seed via GET API...");
        
        // Use native driver to DROP collections (clears indexes)
        const collections = await mongoose.connection.db.listCollections().toArray();
        if (collections.find(c => c.name === 'jobs')) await mongoose.connection.db.dropCollection('jobs');
        if (collections.find(c => c.name === 'companies')) await mongoose.connection.db.dropCollection('companies');
        
        // Clear recruiters to avoid email collision
        await User.deleteMany({ role: 'recruiter' });

        const recruiterEmail = "admin@jobportal.com"; 
        const recruiterUser = await User.create({ 
            name: "Stack HR India", 
            email: recruiterEmail, 
            password: "password123", 
            role: "recruiter" 
        });

        // Use ONLY ONE company to start if needed, but two should work now that indexes are cleared
        const companies = await Company.insertMany([
            { name: "Stack Solutions India", logo: "https://res.cloudinary.com/dztv9p1f1/image/upload/v1712242133/logos/stack_logo_ivvjqz.png", description: "Consultancy", website: "https://stacksolutions.in", location: "Bangalore", industry: "IT", createdBy: recruiterUser._id },
            { name: "FinTech Hub Mumbai", logo: "https://res.cloudinary.com/dztv9p1f1/image/upload/v1712242133/logos/fintech_logo_n2yvqz.png", description: "Banking", website: "https://fintechhub.com", location: "Mumbai", industry: "FinTech", createdBy: recruiterUser._id }
        ]);

        const jobs = [
            { title: "💻 Frontend Developer", location: "Bangalore", category: "Programming", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹8L - ₹15L", experience: "2-5 Years", jobType: "Full-time", skillsRequired: ["React", "CSS"], workMode: "Hybrid" },
            { title: "⚙️ Backend Engineer", location: "Hyderabad", category: "Programming", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "₹12L - ₹20L", experience: "3-6 Years", jobType: "Full-time", skillsRequired: ["NodeJS", "SQL"], workMode: "Work from Office" },
            { title: "🚀 Full Stack Developer", location: "Remote", category: "Programming", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹10L - ₹18L", experience: "3+ Years", jobType: "Remote", skillsRequired: ["MERN"], workMode: "Work from Home" },
            { title: "📱 iOS App Developer", location: "London", category: "Programming", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "£60K - £90K", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Swift"], workMode: "Hybrid" },
            { title: "☁️ DevOps Architect", location: "Washington", category: "Networking", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "$120K - $150K", experience: "8+ Years", jobType: "Full-time", skillsRequired: ["AWS", "K8s"], workMode: "Work from Office" },
            { title: "🎨 UI/UX Designer", location: "Mumbai", category: "Designing", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹6L - ₹10L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Figma"], workMode: "Work from Office" },
            { title: "🖌️ Graphic Designer", location: "New York", category: "Designing", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "$70K - $90K", experience: "1-3 Years", jobType: "Full-time", skillsRequired: ["Adobe"], workMode: "Hybrid" },
            { title: "💡 Product Manager", location: "California", category: "Management", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "$130K - $160K", experience: "4+ Years", jobType: "Full-time", skillsRequired: ["Strategy"], workMode: "Hybrid" },
            { title: "📈 Data Scientist", location: "Chennai", category: "Data Science", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "₹9L - ₹14L", experience: "2-5 Years", jobType: "Full-time", skillsRequired: ["Python"], workMode: "Work from Office" },
            { title: "🤝 Account Executive", location: "Dubai", category: "Marketing", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "AED 150K - 200K", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Sales"], workMode: "Work from Office" },
            { title: "🌱 Trainee Engineer", location: "Bangalore", category: "Programming", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹3L - ₹5L", experience: "Fresher", jobType: "Full-time", skillsRequired: ["JS"], workMode: "Work from Office" },
            { title: "🛠️ QA Intern", location: "Remote", category: "Programming", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "$20/hr", experience: "Fresher", jobType: "Internship", skillsRequired: ["Testing"], workMode: "Work from Home" },
            { title: "📢 Social Media Manager", location: "Mumbai", category: "Marketing", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹4L - ₹8L", experience: "1-3 Years", jobType: "Full-time", skillsRequired: ["Social"], workMode: "Hybrid" },
            { title: "🛡️ Cybersecurity Analyst", location: "Washington", category: "Cybersecurity", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "$100K - $140K", experience: "4-7 Years", jobType: "Full-time", skillsRequired: ["Security"], workMode: "Work from Office" },
            { title: "📊 Machine Learning Engineer", location: "California", category: "Data Science", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "$140K - $180K", experience: "3-6 Years", jobType: "Full-time", skillsRequired: ["ML", "Python"], workMode: "Work from Office" },
            { title: "📡 Network Administrator", location: "Hyderabad", category: "Networking", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "₹5L - ₹9L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Cisco"], workMode: "Work from Office" },
            { title: "🖋️ Technical Writer", location: "Remote", category: "Management", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "₹8L - ₹12L", experience: "3+ Years", jobType: "Remote", skillsRequired: ["Docs"], workMode: "Work from Home" },
            { title: "🎧 Customer Success Manager", location: "London", category: "Management", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "£45K - £65K", experience: "5+ Years", jobType: "Full-time", skillsRequired: ["CRM"], workMode: "Hybrid" },
            { title: "💼 VP of Sales", location: "New York", category: "Marketing", companyName: "Stack Solutions India", companyId: companies[0]._id, salaryRange: "$150K - $200K", experience: "4-8 Years", jobType: "Full-time", skillsRequired: ["Sales", "Leadership"], workMode: "Work from Office" },
            { title: "📝 Copywriter", location: "Dubai", category: "Marketing", companyName: "FinTech Hub Mumbai", companyId: companies[1]._id, salaryRange: "AED 80K - 120K", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Copy"], workMode: "Hybrid" }
        ];

        const finalJobs = jobs.map(j => ({
            ...j,
            description: `<p>Exciting opportunity for a ${j.title}. This role offers excellent career prospects and growth in a dynamic environment.</p>`,
            responsibilities: "<ul><li>Lead initiatives</li><li>Collaborate with teams</li></ul>",
            qualifications: { required: ["Degree"], preferred: ["Experience"] },
            perks: ["Salary", "Benefits"]
        }));

        await Job.insertMany(finalJobs);
        console.log("Nuclear seeding successful! Jobs visible.");
        res.json({ success: true, message: "Nuclear overhaul complete! 20 jobs live." });
    } catch (err) {
        console.error("Seed error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/webhooks', clerkWebhooks)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/company', companyRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app)

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})