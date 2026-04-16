import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { AppContext } from "../context/jobPortalContext";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { JobCategories } from "../assets/assets";

const AddJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { backendUrl, token } = useContext(AppContext);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Junior Level");
  const [salaryRange, setSalaryRange] = useState("");
  const [experience, setExperience] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [workMode, setWorkMode] = useState("Work from Office");
  const [openings, setOpenings] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [perks, setPerks] = useState("");

  const editorRef = useRef(null);
  const responsibilitiesRef = useRef(null);
  const qualificationsRef = useRef(null);
  
  const quillDesc = useRef(null);
  const quillResp = useRef(null);
  const quillQual = useRef(null);

  useEffect(() => {
    if (!quillDesc.current && editorRef.current) {
        quillDesc.current = new Quill(editorRef.current, { theme: "snow", placeholder: "General Job Description..." });
    }
    if (!quillResp.current && responsibilitiesRef.current) {
        quillResp.current = new Quill(responsibilitiesRef.current, { theme: "snow", placeholder: "Key Roles and Responsibilities..." });
    }
    if (!quillQual.current && qualificationsRef.current) {
        quillQual.current = new Quill(qualificationsRef.current, { theme: "snow", placeholder: "Required Qualifications..." });
    }
  }, []);

  useEffect(() => {
    const fetchJobData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/users/job/${id}`);
            if (data.success) {
                const job = data.job;
                setTitle(job.title);
                setLocation(job.location);
                setCategory(job.category);
                setLevel(job.level);
                setSalaryRange(job.salaryRange);
                setExperience(job.experience);
                setJobType(job.jobType);
                setWorkMode(job.workMode);
                setOpenings(job.openings);
                setDeadline(job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : "");
                setSkillsRequired(job.skillsRequired.join(", "));
                setPerks(job.perks.join(", "));
                
                if (quillDesc.current) quillDesc.current.root.innerHTML = job.description;
                if (quillResp.current) quillResp.current.root.innerHTML = job.responsibilities;
                if (quillQual.current) quillQual.current.root.innerHTML = job.qualifications.required[0] || "";
            }
        } catch (error) {
            toast.error("Failed to fetch job data");
        }
    }
    if (id) fetchJobData();
  }, [id, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const jobData = {
            title,
            location,
            category,
            level,
            salaryRange,
            experience,
            jobType,
            workMode,
            openings: Number(openings),
            deadline,
            skillsRequired: skillsRequired.split(',').map(s => s.trim()).filter(s => s !== ""),
            perks: perks.split(',').map(s => s.trim()).filter(s => s !== ""),
            description: quillDesc.current.root.innerHTML,
            responsibilities: quillResp.current.root.innerHTML,
            qualifications: {
                required: [quillQual.current.root.innerHTML],
                preferred: []
            }
        };
        if (id) {
            // Update Existing Job
            const { data } = await axios.post(`${backendUrl}/api/company/update-job/${id}`, jobData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success("Job updated successfully!");
                navigate('/dashboard/manage-jobs');
            } else {
                toast.error(data.message);
            }
        } else {
            // Post New Job
            const { data } = await axios.post(`${backendUrl}/api/company/post-job`, jobData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success("Job posted successfully!");
                navigate('/dashboard/manage-jobs');
            } else {
                toast.error(data.message);
            }
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-900 max-w-5xl mx-auto rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 animate-in fade-in duration-500">
      <div className="mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
            {id ? 'Update Job Requirement' : 'Post a New Requirement'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{id ? 'Modify the details of your existing vacancy' : 'Provide detailed information about the vacancy to attract top talent.'}</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* Section 1: Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Developer"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Range</label>
            <input
              type="text"
              placeholder="e.g. $80k - $120k"
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
              onChange={(e) => setSalaryRange(e.target.value)}
              value={salaryRange}
              required
            />
          </div>
        </div>

        {/* Section 2: Logistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
            <select
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            >
                <option className="dark:bg-slate-900">Bangalore</option>
                <option className="dark:bg-slate-900">Mumbai</option>
                <option className="dark:bg-slate-900">Hyderabad</option>
                <option className="dark:bg-slate-900">Chennai</option>
                <option className="dark:bg-slate-900">Remote</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
            <select
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {JobCategories.map((cat, index) => (
                    <option className="dark:bg-slate-900" key={index} value={cat}>{cat}</option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Type</label>
            <select
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
            >
                <option className="dark:bg-slate-900">Full-time</option>
                <option className="dark:bg-slate-900">Part-time</option>
                <option className="dark:bg-slate-900">Internship</option>
                <option className="dark:bg-slate-900">Remote</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Work Mode</label>
            <select
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
            >
                <option className="dark:bg-slate-900">Work from Office</option>
                <option className="dark:bg-slate-900">Work from Home</option>
                <option className="dark:bg-slate-900">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Level</label>
            <select
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
            >
                <option className="dark:bg-slate-900">Intern</option>
                <option className="dark:bg-slate-900">Junior Level</option>
                <option className="dark:bg-slate-900">Intermediate</option>
                <option className="dark:bg-slate-900">Senior Level</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Experience Required</label>
                <input
                    type="text"
                    placeholder="e.g. 3+ Years"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Openings</label>
                <input
                    type="number"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                    value={openings}
                    onChange={(e) => setOpenings(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Application Deadline</label>
                <input
                    type="date"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
            </div>
        </div>

        {/* Section 3: Professional Enrichment */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skills Required (Comma separated)</label>
                <input
                    type="text"
                    placeholder="Python, React, AWS, Docker"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                    value={skillsRequired}
                    onChange={(e) => setSkillsRequired(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Perks & Benefits (Comma separated)</label>
                <input
                    type="text"
                    placeholder="Health Insurance, Flexible Hours, Gym"
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3 px-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                    value={perks}
                    onChange={(e) => setPerks(e.target.value)}
                />
            </div>
        </div>

        {/* Section 4: Elaborate Descriptions */}
        <div className="space-y-8 pt-4">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Job Description</label>
                <div ref={editorRef} className="bg-white dark:bg-slate-800 border text-black dark:text-white border-gray-200 dark:border-white/5 rounded-xl min-h-[150px] overflow-hidden"></div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Roles & Responsibilities</label>
                <div ref={responsibilitiesRef} className="bg-white dark:bg-slate-800 border text-black dark:text-white border-gray-200 dark:border-white/5 rounded-xl min-h-[150px] overflow-hidden"></div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Required Qualifications</label>
                <div ref={qualificationsRef} className="bg-white dark:bg-slate-800 border text-black dark:text-white border-gray-200 dark:border-white/5 rounded-xl min-h-[150px] overflow-hidden"></div>
            </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-12 py-3.5 rounded-full font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
          >
            {id ? 'UPDATE JOB POSTING' : 'PUBLISH JOB POSTING'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
