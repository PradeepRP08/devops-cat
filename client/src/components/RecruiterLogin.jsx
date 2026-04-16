import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/jobPortalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useSignIn, useSignUp } from "@clerk/clerk-react";

const AuthModal = () => {
  const [state, setState] = useState("Login");
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { setShowRecruiterLogin, backendUrl, setToken, setUserData } = useContext(AppContext);

  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();

  const handleGoogleAuth = async () => {
    if (!isSignInLoaded || !isSignUpLoaded) return;
    try {
      // Determine what role they selected if they are signing up. In 'Login' state we don't have a role toggle.
      // Wait, there's no role toggle on Google auth, we use 'job-user' vs 'job-recruiter' standard sync.
      
      const config = {
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/sso-callback",
        fallbackRedirectUrl: "/sso-callback",
        forceRedirectUrl: "/sso-callback",
        continueSignUpUrl: "/sso-callback",
        signUpFallbackRedirectUrl: "/sso-callback",
        signUpForceRedirectUrl: "/sso-callback"
      };

      if (state === "Login") {
        await signIn.authenticateWithRedirect(config);
      } else {
        await signUp.authenticateWithRedirect(config);
      }
      
      localStorage.setItem('job-role-sync', role || 'user');
    } catch (err) {
      toast.error("Google Auth failed");
      console.error(err);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/auth/login", { email, password });
        
        if (data.success) {
          setToken(data.token);
          setUserData(data.user);
          localStorage.setItem('job-token', data.token);
          setShowRecruiterLogin(false);
          toast.success("Logged in successfully");
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign Up
        const { data } = await axios.post(backendUrl + "/api/auth/register", { name, email, password, role });
        
        if (data.success) {
          setToken(data.token);
          setUserData(data.user);
          localStorage.setItem('job-token', data.token);
          setShowRecruiterLogin(false);
          toast.success("Account created successfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <form
        onSubmit={onSubmitHandler}
        className="relative bg-white dark:bg-slate-900 w-full max-w-md p-8 sm:p-10 rounded-2xl shadow-2xl animate-in zoom-in duration-300 border dark:border-white/5"
      >
        <button 
          type="button"
          onClick={() => setShowRecruiterLogin(false)} 
          className="absolute top-5 right-5 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
        >
          <img className="w-4 dark:invert" src={assets.cross_icon} alt="Close" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {state === "Login" ? "Welcome Back" : "Join Stack Job"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {state === "Login" 
              ? "Please enter your details to sign in" 
              : "Create an account to start your journey"}
          </p>
        </div>

        {/* Role Selector */}
        {state === "Sign Up" && (
          <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === "user" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setRole("recruiter")}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === "recruiter" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
            >
              Recruiter
            </button>
          </div>
        )}

        <div className="space-y-4">
          {state === "Sign Up" && (
            <div className="relative">
              <img className="absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-40 dark:invert" src={assets.person_icon} alt="" />
              <input
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3.5 pl-11 pr-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder={role === 'user' ? 'Full Name' : 'Company Name'}
                required
              />
            </div>
          )}

          <div className="relative">
            <img className="absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-40 dark:invert" src={assets.email_icon} alt="" />
            <input
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3.5 pl-11 pr-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email address"
              required
            />
          </div>

          <div className="relative">
            <img className="absolute left-4 top-1/2 -translate-y-1/2 w-4 opacity-40 dark:invert" src={assets.lock_icon} alt="" />
            <input
              className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 outline-none text-sm py-3.5 pl-11 pr-4 rounded-xl focus:border-blue-500 transition-all text-black dark:text-white"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
            />
          </div>
        </div>

        {state === "Login" && (
          <p className="text-right text-sm text-blue-600 dark:text-blue-400 mt-3 cursor-pointer hover:underline font-medium">
            Forgot password?
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl mt-8 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]"
        >
          {state === "Login" ? "Sign In" : "Create Account"}
        </button>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100 dark:border-white/5"></span></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-gray-400 dark:text-gray-500 font-bold tracking-widest">Or continue with</span></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
          {state === "Login" ? (
            <>
              Don't have an account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => setState("Sign Up")}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                onClick={() => setState("Login")}
              >
                Sign In
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthModal;
