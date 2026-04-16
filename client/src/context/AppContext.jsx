import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from './jobPortalContext';
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const [token, setToken] = useState(localStorage.getItem('job-token') || "");
    const [userData, setUserData] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('job-theme') || 'light');
    const [isSearched, setIsSearched] = useState(false);
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: '',
        jobType: '',
        level: '',
        experience: '',
        salaryMin: 0
    });

    const { getToken, isSignedIn, signOut } = useAuth();
    const { user } = useUser();
    const isLoggingOut = useRef(false);

    useEffect(() => {
        const syncClerkToBackend = async () => {
            if (isSignedIn && user && !token && !isLoggingOut.current) {
                try {
                    const clerkToken = await getToken();
                    const role = localStorage.getItem('job-role-sync') || 'user';
                    
                    const { data } = await axios.post(`${backendUrl}/api/auth/clerk-sync`, {
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName || user.firstName || "User",
                        role: role,
                        clerkToken
                    });
                    
                    if (data.success) {
                        setToken(data.token);
                        setUserData(data.user);
                        localStorage.setItem('job-token', data.token);
                        localStorage.removeItem('job-role-sync');
                        setShowRecruiterLogin(false);
                        toast.success("Successfully authenticated with Google");
                    }
                } catch (error) {
                    console.error("Clerk Sync Error:", error);
                }
            }
        };
        syncClerkToBackend();
    }, [isSignedIn, user, token, backendUrl]);

    const [userApplications, setUserApplications] = useState([]);
    const [recruiterStats, setRecruiterStats] = useState(null);
    const [recruiterJobs, setRecruiterJobs] = useState([]);

    // Function to fetch all jobs with current filters
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const { title, location, jobType, level, experience, salaryMin } = searchFilter;
            const params = new URLSearchParams();
            if (title) params.append('search', title);
            if (location) params.append('location', location);
            if (jobType) params.append('jobType', jobType);
            if (level) params.append('level', level);
            if (experience) params.append('experience', experience);
            if (salaryMin) params.append('salaryMin', salaryMin);

            const { data } = await axios.get(`${backendUrl}/api/users/jobs?${params.toString()}`);
            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    // Function to fetch user data and role-specific data
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setUserData(data.user);
                if (data.user.role === 'recruiter') {
                    fetchRecruiterData();
                } else {
                    fetchUserSpecificData();
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchUserSpecificData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) setUserApplications(data.applications);
        } catch (error) {
            console.error(error.message);
        }
    }

    const fetchRecruiterData = async () => {
        try {
            const statsRes = await axios.get(backendUrl + '/api/company/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (statsRes.data.success) setRecruiterStats(statsRes.data.stats);

            const jobsRes = await axios.get(backendUrl + '/api/company/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (jobsRes.data.success) setRecruiterJobs(jobsRes.data.jobs);
        } catch (error) {
            console.error(error.message);
        }
    }

    const logout = async () => {
        isLoggingOut.current = true;
        setToken("");
        setUserData(null);
        setUserApplications([]);
        setRecruiterStats(null);
        setRecruiterJobs([]);
        localStorage.removeItem('job-token');
        try {
            await signOut();
        } catch (error) {
            console.error("Logout Error:", error);
        } finally {
            // Prevent immediate re-sync with Clerk for 1 second
            setTimeout(() => {
                isLoggingOut.current = false;
            }, 1000);
            toast.success("Logged out successfully");
        }
    }

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- load jobs once on mount
    }, []);

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- run when auth token changes
    }, [token]);

    // Theme Effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('job-theme', theme);
    }, [theme]);

    const value = {
        backendUrl,
        token, setToken,
        userData, setUserData,
        jobs, setJobs,
        loading, setLoading,
        theme, setTheme,
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        showRecruiterLogin, setShowRecruiterLogin,
        userApplications, setUserApplications,
        recruiterStats, setRecruiterStats,
        recruiterJobs, setRecruiterJobs,
        fetchJobs, fetchUserData, logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}