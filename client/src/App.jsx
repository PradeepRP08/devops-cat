import React, { useContext } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ApplyJob from "./pages/ApplyJob";
import Application from "./pages/Application";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/jobPortalContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ViewApplications from "./pages/ViewApplications";
import ManageJobs from "./pages/ManageJobs.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import CompanyProfile from "./pages/CompanyProfile.jsx";
import Chatbot from "./components/Chatbot.jsx";
import "quill/dist/quill.snow.css";
import SsoCallbackComponent from "./pages/SsoCallback.jsx";

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div>
      <ToastContainer />
      {showRecruiterLogin && <RecruiterLogin />}
      <Chatbot />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/application" element={<Application />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/sso-callback/*" element={<SsoCallbackComponent />} />

        {/* Dashboard + Nested Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-job" element={<AddJob />} />
          <Route path="edit-job/:id" element={<AddJob />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
