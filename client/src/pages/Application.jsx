import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { AppContext } from '../context/jobPortalContext'
import moment from "moment";
import Footer from "../components/Footer";

const Applications = () => {
  const { userApplications, fetchUserData, token } = useContext(AppContext);

  useEffect(() => {
    if (token) {
        fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container px-4 sm:px-8 2xl:px-20 mx-auto py-12">
        
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Application History</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Track your progress and stay updated on your active applications.</p>
        </div>

        {/* Stats Summary for User */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm animate-in zoom-in duration-500">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Applied</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{userApplications.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm animate-in zoom-in duration-700">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Interview Stages</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {userApplications.filter(app => app.status === 'Interview Scheduled').length}
                </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm animate-in zoom-in duration-1000">
                <p className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Selected</p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                    {userApplications.filter(app => app.status === 'Selected').length}
                </p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 dark:divide-white/5">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-slate-800/50">
                            <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Company</th>
                            <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Job Title</th>
                            <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest max-sm:hidden">Location</th>
                            <th className="py-5 px-6 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest max-sm:hidden">Date Applied</th>
                            <th className="py-5 px-6 text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                        {userApplications.length > 0 ? userApplications.map((app, index) => (
                            <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="py-5 px-6 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
                                            <img className="max-h-full max-w-full dark:invert opacity-80" src={app.jobId.companyLogo || assets.company_icon} alt="" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{app.jobId.companyName}</span>
                                    </div>
                                </td>
                                <td className="py-5 px-6 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.jobId.title}</span>
                                </td>
                                <td className="py-5 px-6 whitespace-nowrap max-sm:hidden text-sm text-gray-500 dark:text-gray-400 font-medium">{app.jobId.location}</td>
                                <td className="py-5 px-6 whitespace-nowrap max-sm:hidden text-sm text-gray-400 dark:text-gray-600">{moment(app.createdAt).format('ll')}</td>
                                <td className="py-5 px-6 whitespace-nowrap text-center">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${
                                        app.status === 'Selected' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' :
                                        app.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800' :
                                        app.status === 'Shortlisted' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                                        app.status === 'Interview Scheduled' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800' :
                                        'bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/5'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="py-24 text-center text-gray-400 italic font-medium">
                                    You haven't applied for any jobs yet. Start exploring!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Applications;
