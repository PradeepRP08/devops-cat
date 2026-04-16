import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/jobPortalContext";

const Hero = () => {
  const { setSearchFilter, setIsSearched, fetchJobs } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter(prev => ({
        ...prev,
        title: titleRef.current.value,
        location: locationRef.current.value,
    }));
    setIsSearched(true);
    fetchJobs(); // Trigger the backend search
  };

  return (
    <div className="container 2xl:px-20 mx-auto pt-12 pb-20">
      <div className="relative bg-indigo-900 text-white py-24 px-8 text-center mx-4 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20 animate-pulse delay-1000"></div>

        {/* Content */}
        <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full animate-in fade-in slide-in-from-bottom-2">
                Empowering Your Career Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Dream Career</span> <br /> 
                in the Digital World
            </h1>

            <p className="mb-12 max-w-2xl mx-auto text-lg md:text-xl text-indigo-100/80 font-medium px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                Stack Job connects ambitious professionals with industry-leading companies. 
                Explore 5,000+ opportunities curated for your success.
            </p>

            {/* Advanced Search Bar */}
            <div className="flex flex-col md:flex-row items-center bg-white dark:bg-slate-900/40 backdrop-blur-md p-2 rounded-2xl md:rounded-full shadow-2xl max-w-4xl mx-auto overflow-hidden ring-4 ring-white/10 dark:ring-white/5 animate-in fade-in zoom-in duration-1000">
                <div className="flex items-center gap-3 px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/10 flex-1 w-full group">
                    <img src={assets.search_icon} alt="search" className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity dark:invert" />
                    <input
                        type="text"
                        placeholder="Job title, skills, or company"
                        className="text-base text-gray-800 dark:text-white p-2 outline-none w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium bg-transparent"
                        ref={titleRef}
                    />
                </div>

                <div className="flex items-center gap-3 px-6 py-3 md:py-0 flex-1 w-full group">
                    <img src={assets.location_icon} alt="location" className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity dark:invert" />
                    <input
                        type="text"
                        placeholder="City, state or remote"
                        className="text-base text-gray-800 dark:text-white p-2 outline-none w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium bg-transparent"
                        ref={locationRef}
                    />
                </div>

                <button
                    onClick={onSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-4 font-bold rounded-2xl md:rounded-full shadow-lg shadow-blue-600/20 active:scale-95 transition-all w-full md:w-auto mt-2 md:mt-0"
                >
                    Search
                </button>
            </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="mx-4 mt-8 bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-white/5 shadow-sm p-8 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Industry Leaders Trust Us</p>
          <div className="flex justify-center gap-8 lg:gap-16 flex-wrap opacity-50 dark:opacity-30 grayscale hover:grayscale-0 transition-all dark:invert">
            <img className="h-6" src={assets.microsoft_logo} alt="Microsoft" />
            <img className="h-6" src={assets.walmart_logo} alt="Walmart" />
            <img className="h-6" src={assets.accenture_logo} alt="Accenture" />
            <img className="h-6" src={assets.samsung_logo} alt="Samsung" />
            <img className="h-6" src={assets.amazon_logo} alt="Amazon" />
            <img className="h-6" src={assets.adobe_logo} alt="Adobe" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
