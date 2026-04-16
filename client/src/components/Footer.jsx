import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-white/5 pt-20 pb-10 transition-colors duration-300">
      <div className="container px-4 sm:px-8 2xl:px-20 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <img className="h-10 dark:invert" src={assets.logo} alt="Stack Job" />
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              Connecting today's top talent with tomorrow's leading companies. Build your dream career with Stack Job's professional intelligence.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors cursor-pointer group">
                  <img width={18} src={assets.facebook_icon} alt="Facebook" className="opacity-40 group-hover:opacity-100 dark:invert" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 flex items-center justify-center hover:bg-blue-400 transition-colors cursor-pointer group">
                  <img width={18} src={assets.twitter_icon} alt="Twitter" className="opacity-40 group-hover:opacity-100 group-hover:invert dark:invert" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 flex items-center justify-center hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors cursor-pointer group">
                  <img width={18} src={assets.instagram_icon} alt="Instagram" className="opacity-40 group-hover:opacity-100 dark:invert" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest mb-8">For Candidates</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/application" className="hover:text-blue-600 transition-colors">Applied History</Link></li>
              <li><Link to="/profile" className="hover:text-blue-600 transition-colors">Career Profile</Link></li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Job Alerts</li>
            </ul>
          </div>

          {/* Recruiter Links */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest mb-8">For Employers</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Post a Vacancy</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Talent Search</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Hiring Solutions</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Company Dashboard</li>
            </ul>
          </div>

          {/* Join Newsletter */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-black text-sm uppercase tracking-widest mb-8">Latest Opportunities</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-medium">Subscribe for weekly curated job openings in your field.</p>
            <div className="flex bg-gray-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-gray-100 dark:border-white/5">
                <input className="bg-transparent flex-1 px-4 outline-none text-xs font-bold text-gray-700 dark:text-white" placeholder="Email Address" />
                <button className="bg-gray-900 dark:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-all">Join</button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2025 Stack Job India. All Rights Reserved.</p>
          <div className="flex gap-8 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
