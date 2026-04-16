import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    description: { type: String, required: true },
    website: { type: String },
    location: { type: String },
    foundedIn: { type: Date },
    industry: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Company = mongoose.model('Company', companySchema);

export default Company;
