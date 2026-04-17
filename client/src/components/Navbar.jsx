import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/jobPortalContext";

const Navbar = () => {
  const { setShowRecruiterLogin, token, userData, logout, theme, setTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="shadow py-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <img onClick={() => navigate('/')} className='cursor-pointer h-10' src={assets.logo} alt="Logo" />

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all active:scale-95 text-xl"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

        {token && userData ? (
          <div className="flex items-center gap-6 relative">
            {userData.role === 'user' && (
              <Link to="/application" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Applied Jobs
              </Link>
            )}
            
            {userData.role === 'recruiter' && (
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mr-2">
                Recruiter Dashboard
              </Link>
            )}

            <div className="flex items-center gap-2 cursor-pointer relative group" onClick={() => setShowDropdown(!showDropdown)}>
               <p className="max-sm:hidden text-gray-700 dark:text-gray-300 font-medium">
                Hi, {userData.name.split(' ')[0]}
              </p>
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 uppercase">
                {userData.name[0]}
              </div>
            
            
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg shadow-xl py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50" onClick={() => setShowDropdown(false)}>Settings</Link>
                  <hr className="border-gray-100 dark:border-slate-700" />
                  <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Logout</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 items-center max-sm:text-xs">
            <button onClick={() => setShowRecruiterLogin(true)} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Recruiter Login</button>
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="bg-blue-600 text-white px-7 sm:px-10 py-2.5 rounded-full hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              Login
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
