import React, { useContext, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/jobPortalContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout, recruiterStats } = useContext(AppContext);

  const [showAccountMenu, setShowAccountMenu] = React.useState(false);

  useEffect(() => {
    if (!userData || userData.role !== 'recruiter') {
        navigate('/');
    }
  }, [userData, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <div className="bg-white dark:bg-slate-900 shadow-sm py-4 px-8 flex justify-between items-center sticky top-0 z-30 border-b dark:border-white/5">
        <div className="flex items-center gap-8">
            <img
                onClick={() => navigate("/")}
                className="h-10 cursor-pointer dark:invert"
                src={assets.logo}
                alt="Logo"
            />
            <h2 className="hidden md:block text-lg font-semibold text-gray-700 dark:text-gray-300">Recruiter Console</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{userData?.name}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">Recruiter Account</p>
          </div>
          <div 
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="relative p-1 border dark:border-white/10 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {userData?.name ? userData.name[0].toUpperCase() : '?'}
            </div>
            
            {showAccountMenu && (
                <div className="absolute top-full right-0 mt-2 z-50">
                    <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl shadow-2xl py-2 w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <p className="px-4 py-2 text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest bg-gray-50 dark:bg-slate-900/50">Account Management</p>
                        <Link to="/dashboard/company-profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50" onClick={() => setShowAccountMenu(false)}>Settings</Link>
                        <hr className="my-1 border-gray-100 dark:border-white/5" />
                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-bold flex items-center gap-2">
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-white/5 flex flex-col sticky top-20 h-[calc(100vh-5rem)]">
          <div className="flex-1 py-6">
            <nav className="space-y-1 px-2">
                <NavLink 
                    className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`} 
                    to="/dashboard/add-job"
                >
                    <img className="w-6 h-6 grayscale opacity-70 group-active:grayscale-0 dark:invert" src={assets.add_icon} alt="" />
                    <span className="hidden md:inline ml-3 font-medium">Post New Job</span>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`} 
                    to="/dashboard/company-profile"
                >
                    <img className="w-6 h-6 grayscale opacity-70 group-active:grayscale-0 dark:invert" src={assets.company_icon} alt="" />
                    <span className="hidden md:inline ml-3 font-medium">Company Profile</span>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`} 
                    to="/dashboard/manage-jobs"
                >
                    <img className="w-6 h-6 grayscale opacity-70 dark:invert" src={assets.home_icon} alt="" />
                    <span className="hidden md:inline ml-3 font-medium">Manage Listings</span>
                </NavLink>

                <NavLink 
                    className={({isActive}) => `flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-50' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`} 
                    to="/dashboard/view-applications"
                >
                    <img className="w-6 h-6 grayscale opacity-70 dark:invert" src={assets.person_tick_icon} alt="" />
                    <span className="hidden md:inline ml-3 font-medium">Applications</span>
                </NavLink>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-8">
            
            {/* Stats Overview */}
            {location.pathname === '/dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-300">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Jobs Posted</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{recruiterStats?.totalJobs || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-500">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Applicants</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{recruiterStats?.totalApplicants || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Shortlisted</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{recruiterStats?.shortlistedCandidates || 0}</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow animate-in slide-in-from-bottom-2 duration-1000">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Positions</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{recruiterStats?.activeJobs || 0}</h3>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
                <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
