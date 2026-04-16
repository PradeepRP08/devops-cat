import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/jobPortalContext";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";
import SkeletonListing from "./SkeletonListing";

const JobListing = () => {
    const { isSearched, searchFilter, setSearchFilter, jobs, fetchJobs, loading } = useContext(AppContext);

    const [showFilter, setShowFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Local filter state for immediate UI feedback before fetch
    const [localFilters, setLocalFilters] = useState({
        categories: [],
        locations: [],
        jobType: '',
        experience: ''
    });

    const handleCategoryChange = (val) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(val) ? prev.categories.filter(c => c !== val) : [...prev.categories, val]
        }));
    };

    const handleLocationChange = (val) => {
        setLocalFilters(prev => ({
            ...prev,
            locations: prev.locations.includes(val) ? prev.locations.filter(l => l !== val) : [...prev.locations, val]
        }));
    }

    const clearFilters = () => {
        setSearchFilter({ title: '', location: '', jobType: '', level: '', experience: '', salaryMin: 0 });
        setLocalFilters({ categories: [], locations: [], jobType: '', experience: '' });
        fetchJobs();
    }

    useEffect(() => {
        // Local filtering logic on jobs
    }, [searchFilter, jobs, localFilters]);

    // Apply local filters dynamically
    const filteredJobs = jobs.filter(job => {
        if (localFilters.categories.length > 0 && !localFilters.categories.includes(job.category)) {
            return false;
        }
        if (localFilters.locations.length > 0 && !localFilters.locations.includes(job.location)) {
            return false;
        }
        return true;
    });

    return (
        <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row gap-10 py-12 px-4">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4 space-y-8">
                
                {/* Active Search Chips */}
                {(isSearched || searchFilter.title || searchFilter.location) && (
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100/50 dark:border-blue-800/30">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Current Search</h3>
                            <button onClick={clearFilters} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Clear All</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {searchFilter.title && (
                                <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm">
                                    {searchFilter.title}
                                    <button onClick={() => setSearchFilter(p => ({...p, title: ''}))} className="hover:text-red-500">✕</button>
                                </span>
                            )}
                            {searchFilter.location && (
                                <span className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-400 shadow-sm">
                                    {searchFilter.location}
                                    <button onClick={() => setSearchFilter(p => ({...p, location: ''}))} className="hover:text-red-500">✕</button>
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between lg:hidden mb-4">
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                        {showFilter ? "Hide Filters" : "Show Filters"}
                    </button>
                </div>

                <div className={`${showFilter ? "block" : "hidden lg:block"} space-y-10 animate-in slide-in-from-left-4 duration-500`}>
                    
                    {/* Category Filter */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                            Job Categories
                        </h4>
                        <ul className="space-y-4">
                            {JobCategories.map((cat, idx) => (
                                <li className="flex items-center group cursor-pointer" key={idx} onClick={() => handleCategoryChange(cat)}>
                                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${localFilters.categories.includes(cat) ? 'bg-blue-600 border-blue-600' : 'border-gray-200 dark:border-slate-700 group-hover:border-blue-400'}`}>
                                        {localFilters.categories.includes(cat) && <span className="text-white text-[10px]">✓</span>}
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${localFilters.categories.includes(cat) ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'}`}>{cat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Location Filter */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                             <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
                             Preferred Location
                        </h4>
                        <ul className="space-y-4">
                            {JobLocations.map((loc, idx) => (
                                <li className="flex items-center group cursor-pointer" key={idx} onClick={() => handleLocationChange(loc)}>
                                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all ${localFilters.locations.includes(loc) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 dark:border-slate-700 group-hover:border-indigo-400'}`}>
                                        {localFilters.locations.includes(loc) && <span className="text-white text-[10px]">✓</span>}
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${localFilters.locations.includes(loc) ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400'}`}>{loc}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Job Type Filter */}
                    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                             <span className="w-1.5 h-6 bg-green-600 rounded-full"></span>
                             Job Type
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {['Full-time', 'Part-time', 'Internship', 'Remote'].map((type) => (
                                <button 
                                    key={type}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${searchFilter.jobType === type ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200/50' : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-white/5 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                    onClick={() => setSearchFilter(p => ({...p, jobType: p.jobType === type ? '' : type}))}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Job Listing Section */}
            <section className="flex-1 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white" id="job-list">
                            Explore Opportunities
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Discover your next career milestone among {jobs.length} open positions.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-[10px]">Sort by:</span>
                        <select className="bg-transparent border-b border-gray-200 dark:border-white/10 py-1 font-bold text-gray-900 dark:text-white outline-none cursor-pointer">
                            <option className="dark:bg-slate-900">Newest First</option>
                            <option className="dark:bg-slate-900">Highest Salary</option>
                            <option className="dark:bg-slate-900">Experience Required</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <SkeletonListing />
                ) : filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {filteredJobs
                            .slice((currentPage - 1) * 6, currentPage * 6)
                            .map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-gray-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">No jobs matching your criteria. Try adjusting your filters.</p>
                        <button onClick={clearFilters} className="mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline">Reset all filters</button>
                    </div>
                )}

                {/* Modern Pagination */}
                {jobs.length > 6 && (
                    <div className="flex items-center justify-center gap-3 mt-16 pb-12">
                        <button
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <img className="w-5 grayscale rotate-180 dark:invert" src={assets.right_arrow_icon} alt="Prev" />
                        </button>

                        <div className="flex gap-2">
                             {Array.from({ length: Math.ceil(jobs.length / 6) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all border ${
                                        currentPage === index + 1
                                            ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200/50 scale-110"
                                            : "bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(jobs.length / 6)))}
                            disabled={currentPage === Math.ceil(jobs.length / 6)}
                            className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-sm text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <img className="w-5 grayscale dark:invert" src={assets.right_arrow_icon} alt="Next" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default JobListing;
