import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/jobPortalContext";
import Loading from "../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";

const getResumeUrl = (resume, backendUrl) => {
  if (!resume || typeof resume !== "string") return null;

  const trimmedResume = resume.trim();
  const trimmedBackendUrl = (backendUrl || "").trim().replace(/\/$/, "");

  if (
    trimmedResume.startsWith("http://") ||
    trimmedResume.startsWith("https://")
  ) {
    return trimmedResume;
  }

  // Ensure relative path doesn't have leading slash when joining with backendUrl
  const relativePath = trimmedResume.replace(/^\/+/, "");
  return `${trimmedBackendUrl}/${relativePath}`;
};

const ApplyJob = () => {
  const { id } = useParams();
  const { jobs, backendUrl, userData, token, fetchUserData } =
    useContext(AppContext);

  const [jobData, setJobData] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    skills: "",
    education: { degree: "", college: "", year: "" },
    experience: { level: "fresher", details: "" },
    portfolioLinks: { github: "", linkedin: "", website: "" },
    currentLocation: "",
    salaryExpectation: "",
    availability: "Immediate",
  });

  const handleQuickLook = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const fetchJob = async () => {
    const foundJob = jobs.find((job) => job._id === id);

    if (foundJob) {
      setJobData(foundJob);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/users/job/${id}`);
      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message || "Failed to fetch job");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  useEffect(() => {
    if (jobs.length > 0) {
      fetchJob();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, jobs]);

  useEffect(() => {
    if (userData && id) {
      setIsApplied(
        userData.applications?.some((app) => app.jobId === id) || false
      );
      setIsSaved(
        userData.savedJobs?.some((savedId) => savedId === id) || false
      );

      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        skills: Array.isArray(userData.skills)
          ? userData.skills.join(", ")
          : "",
        education:
          userData.education && userData.education.length > 0
            ? {
                degree: userData.education[0].degree || "",
                college: userData.education[0].institution || "",
                year: userData.education[0].endYear?.toString() || "",
              }
            : prev.education,
        experience:
          userData.experience && userData.experience.length > 0
            ? {
                level: "experienced",
                details: `${userData.experience[0].role || ""} at ${
                  userData.experience[0].company || ""
                } (${userData.experience[0].duration || ""})`,
              }
            : prev.experience,
        portfolioLinks: userData.links || prev.portfolioLinks,
        currentLocation: userData.location || "",
      }));
    }
  }, [userData, id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return toast.error("Please login to apply");
    }

    if (userData?.role !== "user") {
      return toast.error("Only candidates can apply");
    }

    if (!formData.resume && !userData?.resume) {
      return toast.error("Please upload your resume");
    }

    try {
      setSubmitting(true);

      const submitForm = new FormData();
      submitForm.append("jobId", id);
      submitForm.append("fullName", formData.fullName);
      submitForm.append("email", formData.email);
      submitForm.append("phone", formData.phone);

      if (formData.resume) {
        submitForm.append("resume", formData.resume);
      } else if (userData?.resume) {
        submitForm.append("existingResume", userData.resume);
      }

      submitForm.append("coverLetter", formData.coverLetter);
      submitForm.append("skills", formData.skills);
      submitForm.append("education", JSON.stringify(formData.education));
      submitForm.append("experience", JSON.stringify(formData.experience));
      submitForm.append(
        "portfolioLinks",
        JSON.stringify(formData.portfolioLinks)
      );
      submitForm.append("currentLocation", formData.currentLocation);
      submitForm.append("salaryExpectation", formData.salaryExpectation);
      submitForm.append("availability", formData.availability);

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        submitForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Application submitted successfully");
        setIsApplied(true);
        setShowForm(false);
        setFormData((prev) => ({
          ...prev,
          resume: null,
          coverLetter: "",
          salaryExpectation: "",
          availability: "Immediate",
        }));
        fetchUserData();
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const saveJobHandler = async () => {
    if (!token) return toast.error("Please login to save jobs");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/save-job`,
        { jobId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsSaved(!isSaved);
        fetchUserData();
      } else {
        toast.error(data.message || "Failed to save job");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  if (!jobData) return <Loading />;

  const currentResumeUrl = getResumeUrl(userData?.resume, backendUrl);

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen relative transition-colors duration-300">
      <Navbar />

      <main className="container px-4 sm:px-8 2xl:px-20 mx-auto py-12">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/5 mb-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-6 flex items-center justify-center">
              <img
                className="max-h-full max-w-full dark:invert opacity-80"
                src={
                  jobData.companyId?.logo ||
                  jobData.companyLogo ||
                  assets.company_icon
                }
                alt="Company Logo"
              />
            </div>

            <div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                  {jobData.jobType}
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                  {jobData.workMode}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                {jobData.title}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-500 dark:text-gray-400 font-bold">
                <span>{jobData.companyName}</span>
                <span className="flex items-center gap-2">
                  <img className="w-4 dark:invert" src={assets.location_icon} alt="" />
                  {jobData.location}
                </span>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-gray-400 dark:text-gray-600 font-medium">
                  Posted {moment(jobData.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button
              disabled={isApplied}
              onClick={() => setShowForm(true)}
              className={`w-full md:w-56 py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                isApplied
                  ? "bg-green-100 text-green-600 cursor-default shadow-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              {isApplied ? "Already Applied" : "Submit Application"}
            </button>

            <button
              onClick={saveJobHandler}
              className={`w-full md:w-56 py-4 rounded-2xl font-black border transition-all flex items-center justify-center gap-2 ${
                isSaved
                  ? "border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              {isSaved ? "Saved to Favorites" : "Save for Later"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Salary Range
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {jobData.salaryRange || "Best in Industry"}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Experience
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {jobData.experience}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Openings
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {jobData.openings || 1}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Level
                </p>
                <p className="text-base font-bold text-gray-900 dark:text-white">
                  {jobData.level}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 sm:p-14 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-3 h-8 bg-blue-600 rounded-full"></span>
                Job Details
              </h3>
              <div
                className="text-gray-600 dark:text-gray-400 leading-loose prose prose-blue dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              ></div>
            </div>
          </div>

          <aside className="space-y-10">
            <div className="bg-indigo-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <h4 className="text-lg font-black mb-4 flex items-center gap-2">
                ✨ Quick Facts
              </h4>
              <ul className="space-y-4 text-indigo-100/80 font-bold text-sm">
                <li className="flex justify-between">
                  <span>Work Mode:</span>
                  <span className="text-white">{jobData.workMode}</span>
                </li>
                <li className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-white">
                    {jobData.title?.split(" ")[0]}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Salary:</span>
                  <span className="text-white font-black">
                    {jobData.salaryRange}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto pt-20 pb-20">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[3rem] shadow-2xl p-8 sm:p-12 animate-in zoom-in duration-300 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-8 right-8 p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <img className="w-5 dark:invert" src={assets.cross_icon} alt="Close" />
            </button>

            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Apply for {jobData.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium">
              Please fill in your details professionally.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-bold text-black dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-bold text-black dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Phone Number
                  </label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-bold text-black dark:text-white"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Current Location
                  </label>
                  <input
                    required
                    value={formData.currentLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentLocation: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-bold text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    Upload Resume (PDF/DOC)
                  </label>

                  <div className="relative flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        required={!userData?.resume}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resume: e.target.files?.[0] || null,
                          })
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />

                      <div className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-500 dark:text-gray-400">
                        <span className="text-xl">📁</span>
                        {formData.resume
                          ? formData.resume.name
                          : userData?.resume
                          ? "Use existing resume or upload new one"
                          : "Select File"}
                      </div>
                    </div>

                    {formData.resume && (
                      <button
                        type="button"
                        onClick={() => handleQuickLook(formData.resume)}
                        className="px-4 py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-all text-xs whitespace-nowrap"
                      >
                        Quick Look ✨
                      </button>
                    )}
                  </div>

                  {currentResumeUrl && !formData.resume && (
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-[10px] text-blue-600 font-bold italic">
                        Using previously uploaded resume.
                      </p>
                      <a
                        href={currentResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-blue-600 underline"
                      >
                        View Current Resume
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Skills (Comma separated)
                  </label>
                  <input
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all font-bold text-black dark:text-white"
                    placeholder="React, Node, MongoDB..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-6">
                <h4 className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">
                  Education Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    placeholder="Degree"
                    value={formData.education.degree}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education: {
                          ...formData.education,
                          degree: e.target.value,
                        },
                      })
                    }
                    className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                  />

                  <input
                    placeholder="College/University"
                    value={formData.education.college}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education: {
                          ...formData.education,
                          college: e.target.value,
                        },
                      })
                    }
                    className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                  />

                  <input
                    placeholder="Year"
                    value={formData.education.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        education: {
                          ...formData.education,
                          year: e.target.value,
                        },
                      })
                    }
                    className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 p-8 rounded-3xl space-y-6">
                <h4 className="font-black text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">
                  Work Experience
                </h4>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        experience: {
                          ...formData.experience,
                          level: "fresher",
                        },
                      })
                    }
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      formData.experience.level === "fresher"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50"
                        : "bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/5"
                    }`}
                  >
                    Fresher
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        experience: {
                          ...formData.experience,
                          level: "experienced",
                        },
                      })
                    }
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      formData.experience.level === "experienced"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50"
                        : "bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-white/5"
                    }`}
                  >
                    Experienced
                  </button>
                </div>

                <textarea
                  placeholder="Describe your experience or internships..."
                  value={formData.experience.details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: {
                        ...formData.experience,
                        details: e.target.value,
                      },
                    })
                  }
                  rows="3"
                  className="w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Salary Expectation (Monthly/Annual)
                  </label>
                  <input
                    value={formData.salaryExpectation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryExpectation: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                    placeholder="e.g. ₹50k or ₹12 LPA"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Availability
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availability: e.target.value,
                      })
                    }
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl outline-none font-bold text-black dark:text-white"
                  >
                    <option className="dark:bg-slate-800" value="Immediate">Immediate</option>
                    <option className="dark:bg-slate-800" value="Notice period">Notice period</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full font-black py-5 rounded-3xl shadow-2xl transition-all active:scale-95 text-lg ${
                  submitting
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}
              >
                {submitting ? "Submitting..." : "Complete Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ApplyJob;