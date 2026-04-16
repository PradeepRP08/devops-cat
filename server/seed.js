import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import Company from "./models/Company.js";
import User from "./models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!uri) throw new Error("Set MONGO_URI in server/.env");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB for high-fidelity seeding...");

        // Clear existing data
        await Job.deleteMany({});
        await Company.deleteMany({});
        await User.deleteMany({});

        // 1. Create a Default Recruiter User
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash("password123", salt);
        
        const recruiterUser = await User.create({
            name: "Stack HR India",
            email: "admin@jobportal.com",
            password: adminPassword,
            role: "recruiter"
        });

        // 2. Create Companies
        const companies = await Company.insertMany([
            {
                name: "Stack Solutions India",
                logo: "https://res.cloudinary.com/dztv9p1f1/image/upload/v1712242133/logos/stack_logo_ivvjqz.png",
                description: "<p>Stack Solutions is a leading technology consultancy specializing in enterprise digital transformation.</p>",
                website: "https://stacksolutions.in",
                location: "Bangalore, KA",
                industry: "Information Technology",
                createdBy: recruiterUser._id
            },
            {
                name: "FinTech Hub Mumbai",
                logo: "https://res.cloudinary.com/dztv9p1f1/image/upload/v1712242133/logos/fintech_logo_n2yvqz.png",
                description: "<p>Driving the future of banking and payments in the heart of Mumbai.</p>",
                website: "https://fintechhub.com",
                location: "Mumbai, MH",
                industry: "FinTech",
                createdBy: recruiterUser._id
            }
        ]);

        const jobs = [
            // Tech Jobs
            { title: "💻 Frontend Developer (React)", location: "Bangalore", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹8L - ₹15L", experience: "2-5 Years", jobType: "Full-time", skillsRequired: ["React", "Tailwind", "State Management"], workMode: "Hybrid" },
            { title: "⚙️ Backend Engineer (Node.js)", location: "Hyderabad", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹12L - ₹20L", experience: "3-6 Years", jobType: "Full-time", skillsRequired: ["Node.js", "Express", "PostgreSQL"], workMode: "Work from Office" },
            { title: "🚀 Full Stack Developer (MERN)", location: "Remote", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹10L - ₹18L", experience: "3+ Years", jobType: "Remote", skillsRequired: ["MongoDB", "React", "Node.js"], workMode: "Work from Home" },
            { title: "📱 Mobile App Developer (Flutter)", location: "Pune", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹7L - ₹12L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Flutter", "Dart", "Firebase"], workMode: "Hybrid" },
            { title: "☁️ DevOps Architect", location: "Bangalore", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹25L - ₹40L", experience: "8+ Years", jobType: "Full-time", skillsRequired: ["AWS", "Kubernetes", "CI/CD"], workMode: "Work from Office" },
            
            // Design Jobs
            { title: "🎨 UI/UX Designer", location: "Mumbai", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹6L - ₹10L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Figma", "Design Systems"], workMode: "Work from Office" },
            { title: "🖌️ Graphic Designer", location: "Delhi", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹4L - ₹7L", experience: "1-3 Years", jobType: "Full-time", skillsRequired: ["Illustrator", "Photoshop"], workMode: "Hybrid" },
            
            // Product & Management
            { title: "💡 Product Manager", location: "Bangalore", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹15L - ₹25L", experience: "4+ Years", jobType: "Full-time", skillsRequired: ["Product Strategy", "Agile"], workMode: "Hybrid" },
            { title: "📈 Data Analyst", location: "Gurgaon", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹9L - ₹14L", experience: "2-5 Years", jobType: "Full-time", skillsRequired: ["Python", "SQL", "Tableau"], workMode: "Work from Office" },
            { title: "🤝 Account Executive", location: "Bangalore", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹6L - ₹12L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Sales", "Communication"], workMode: "Work from Office" },

            // Freshers/Entry Level
            { title: "🌱 Trainee Software Engineer", location: "Chennai", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹3L - ₹5L", experience: "Fresher", jobType: "Full-time", skillsRequired: ["JavaScript", "Problem Solving"], workMode: "Work from Office" },
            { title: "🛠️ QA Intern", location: "Remote", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹1L - ₹2L", experience: "Fresher", jobType: "Internship", skillsRequired: ["Manual Testing", "Attention to Detail"], workMode: "Work from Home" },
            { title: "📢 Social Media Intern", location: "Mumbai", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹1L - ₹1.5L", experience: "Fresher", jobType: "Internship", skillsRequired: ["Instagram", "Content Creation"], workMode: "Hybrid" },

            // More Roles
            { title: "🛡️ Cybersecurity Analyst", location: "Bangalore", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹15L - ₹22L", experience: "4-7 Years", jobType: "Full-time", skillsRequired: ["Network Security", "Ethical Hacking"], workMode: "Work from Office" },
            { title: "📊 ML Engineer", location: "Hyderabad", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹18L - ₹30L", experience: "3-6 Years", jobType: "Full-time", skillsRequired: ["PyTorch", "TensorFlow"], workMode: "Hybrid" },
            { title: "📡 Network Engineer", location: "Noida", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹5L - ₹9L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Cisco", "Routing"], workMode: "Work from Office" },
            { title: "🖋️ Technical Writer", location: "Remote", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹8L - ₹12L", experience: "3+ Years", jobType: "Remote", skillsRequired: ["Documentation", "APIs"], workMode: "Work from Home" },
            { title: "🎧 Customer Success Lead", location: "Bangalore", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹10L - ₹16L", experience: "5+ Years", jobType: "Full-time", skillsRequired: ["CRM", "Client Relationship"], workMode: "Hybrid" },
            { title: "💼 Business Development Manager", location: "Delhi", companyName: companies[0].name, companyId: companies[0]._id, salaryRange: "₹12L - ₹20L", experience: "4-8 Years", jobType: "Full-time", skillsRequired: ["B2B Sales", "Lead Gen"], workMode: "Work from Office" },
            { title: "📝 Copywriter", location: "Mumbai", companyName: companies[1].name, companyId: companies[1]._id, salaryRange: "₹5L - ₹8L", experience: "2-4 Years", jobType: "Full-time", skillsRequired: ["Creative Writing", "SEO"], workMode: "Hybrid" }
        ];

        // Add boilerplate description and other fields to all jobs
        const finalJobs = jobs.map(j => ({
            ...j,
            description: j.description || `<p>Join ${j.companyName} as a ${j.title}. We are looking for passionate individuals who can drive growth and innovation. This role offers excellent career prospects and the chance to work with a talented team of professionals.</p>`,
            responsibilities: "<ul><li>Engage with stakeholders</li><li>Deliver high-quality work within deadlines</li><li>Collaborate across teams</li></ul>",
            qualifications: {
                required: ["Relevant Degree", "Excellent communication skills"],
                preferred: ["Previous experience in similar role", "Self-starter attitude"]
            },
            perks: ["Competitive Salary", "Flexible Working", "Health Insurance"]
        }));

        await Job.insertMany(finalJobs);
        console.log("Modernization Seeding complete! 20 high-fidelity Indian jobs created.");
        
        process.exit();
    } catch (error) {
        console.error("Seeding failed:");
        console.error(error.stack);
        process.exit(1);
    }
};

seedData();
