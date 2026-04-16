import React, { useContext } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/jobPortalContext";
import axios from "axios";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const navigate = useNavigate();
  const { recruiterJobs, backendUrl, token, fetchUserData } = useContext(AppContext);

  const toggleVisibility = async (id) => {
    try {
        const { data } = await axios.post(`${backendUrl}/api/company/update-visibility`, { id }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
            toast.success(data.message || "Job visibility updated");
            fetchUserData(); // Refresh stats and jobs
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) return;
    try {
        const { data } = await axios.delete(`${backendUrl}/api/company/delete-job/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
            toast.success(data.message);
            fetchUserData();
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
  }

  return (
    <div className="p-8 animate-in fade-in duration-500 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Job Postings</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Track and manage your active and closed vacancies.</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-blue-600 text-white py-2.5 px-6 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
        >
          <span className="text-xl">+</span> Add New Job
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title / Location</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicants</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Work Mode</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visible</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-white/5">
            {recruiterJobs.length > 0 ? recruiterJobs.map((job, index) => (
              <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-400 dark:text-gray-500 font-mono">{index + 1}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                   <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</div>
                   <div className="text-xs text-gray-500 dark:text-gray-500">{job.location}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {moment(job.createdAt).format("ll")}
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                   <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                    {job.applicantsCount || 0}
                   </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                        {job.jobType}
                    </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <input 
                    onChange={() => toggleVisibility(job._id)} 
                    className="w-5 h-5 accent-blue-600 cursor-pointer" 
                    type="checkbox" 
                    checked={job.visible} 
                  />
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                   <button 
                     onClick={() => navigate(`/dashboard/edit-job/${job._id}`)}
                     className="text-gray-400 hover:text-blue-600 transition-colors px-2 font-bold"
                   >
                     Edit
                   </button>
                   <button 
                     onClick={() => deleteJob(job._id)}
                     className="text-gray-400 hover:text-red-500 transition-colors px-2 font-bold"
                   >
                     Delete
                   </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="7" className="px-6 py-20 text-center text-gray-400 dark:text-gray-500 italic">
                        No jobs found. Start by posting your first vacancy!
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;
