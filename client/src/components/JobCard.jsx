import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/jobPortalContext';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  
  const skillMatch = () => {
    if (!userData || !job.skillsRequired || userData.role !== 'user') return null;
    const userSkills = userData.skills || [];
    const matchedCount = job.skillsRequired.filter(s => 
        userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase())
    ).length;
    return Math.round((matchedCount / job.skillsRequired.length) * 100);
  };

  const matchScore = skillMatch();

  return (
    <div className="group bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 flex flex-col justify-between animate-in fade-in zoom-in-95 duration-500">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
            <img className="max-h-full max-w-full dark:invert opacity-80" src={job.companyLogo || assets.company_icon} alt={job.companyName} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                {job.jobType}
            </span>
            {job.salaryRange && (
                <span className="text-sm font-bold text-gray-900 dark:text-white">{job.salaryRange}</span>
            )}
            {matchScore !== null && (
                <div className={`mt-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border flex items-center gap-1 ${matchScore > 70 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                    <span className="text-xs">✨</span> {matchScore}% Match
                </div>
            )}
          </div>
        </div>

        <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {job.title}
        </h4>
        
        <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-gray-400 dark:text-gray-500">{job.companyName}</span>
            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></span>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{job.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            {job.skillsRequired && job.skillsRequired.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold border border-gray-100 dark:border-white/5">
                    {skill}
                </span>
            ))}
            {job.skillsRequired?.length > 3 && (
                <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600">+{job.skillsRequired.length - 3} more</span>
            )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50 dark:border-white/5">
        <button
          onClick={() => { navigate(`/apply-job/${job._id}`); window.scrollTo(0, 0); }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-[0.98] shadow-lg shadow-blue-100"
        >
          Apply Now
        </button>
        <button 
          onClick={() => { navigate(`/apply-job/${job._id}`); window.scrollTo(0, 0); }}
          className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all text-sm font-bold border border-gray-100 dark:border-white/5"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
