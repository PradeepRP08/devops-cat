import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/jobPortalContext";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const getResumeUrl = (resume, backendUrl) => {
  if (!resume || typeof resume !== "string") return null;

  const trimmedResume = resume.trim();
  const trimmedBackendUrl = (backendUrl || "").trim().replace(/\/$/, "");

  if (
    trimmedResume.startsWith("http://") ||
    trimmedResume.startsWith("https://")
  ) {
    return trimmedResume;
  }

  // Ensure relative path doesn't have leading slash when joining with backendUrl
  const relativePath = trimmedResume.replace(/^\/+/, "");
  const finalUrl = `${trimmedBackendUrl}/${relativePath}`;
  
  console.log(`[RESUME_VIEW] Stored path: ${trimmedResume}, Final URL: ${finalUrl}`);
  return finalUrl;
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Selected":
      return "bg-green-50 text-green-700 border-green-100";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-100";
    case "Shortlisted":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "Interview Scheduled":
      return "bg-purple-50 text-purple-700 border-purple-100";
    case "Under Review":
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-100";
  }
};

const getMatchScoreTextColor = (score) => {
  if (score > 75) return "text-green-600";
  if (score > 40) return "text-orange-500";
  return "text-gray-400";
};

const getMatchScoreBarColor = (score) => {
  if (score > 75) return "bg-green-500";
  if (score > 40) return "bg-orange-400";
  return "bg-gray-300";
};

const ViewApplications = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const dropdownRef = useRef(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/company/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setApplications(data.applications || []);
      } else {
        toast.error(data.message || "Failed to fetch applications");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/update-status`,
        { applicationId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Status updated successfully");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status } : app
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    if (token) {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500 font-medium">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-500 dark:bg-slate-900 min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Applicant Tracking System
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Review candidates, access resumes, and manage hiring stages.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Candidate
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Applied Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Applied On
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                AI Match
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resume
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Hiring Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {applications.length > 0 ? (
              applications.map((app) => {
                const candidateName = app.fullName || app.userId?.name || "Unknown Candidate";
                const candidateEmail =
                  app.email || app.userId?.email || "No email provided";
                const jobTitle = app.jobId?.title || "No title";
                const matchScore = Number(app.matchScore || 0);
                const resumeValue = app.resume || app.userId?.resume;
                const resumeUrl = getResumeUrl(resumeValue, backendUrl);

                return (
                  <tr
                    key={app._id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800 uppercase mr-3">
                          {candidateName ? candidateName[0] : "?"}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {candidateName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {jobTitle}
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {app.appliedAt || app.createdAt
                        ? moment(app.appliedAt || app.createdAt).format("ll")
                        : "N/A"}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(
                          app.status
                        )}`}
                      >
                        {app.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-xs font-black ${getMatchScoreTextColor(
                            matchScore
                          )}`}
                        >
                          {matchScore}%
                        </span>

                        <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${getMatchScoreBarColor(
                              matchScore
                            )}`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(matchScore, 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      {resumeUrl ? (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all active:scale-95"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-gray-400 italic text-xs font-medium">
                          No Resume
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium relative">
                      <div
                        className="relative inline-block text-left"
                        ref={openDropdownId === app._id ? dropdownRef : null}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === app._id ? null : app._id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all font-black text-lg"
                        >
                          ⋮
                        </button>

                        {openDropdownId === app._id && (
                          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="py-2 text-left">
                              <p className="px-4 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-slate-900/50">
                                Move to stage
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(app._id, "Under Review")
                                }
                                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                Under Review
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(app._id, "Shortlisted")
                                }
                                className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                Shortlist
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(app._id, "Interview Scheduled")
                                }
                                className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                                Schedule Interview
                              </button>

                              <hr className="my-1 border-gray-100 dark:border-slate-700" />

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(app._id, "Selected")
                                }
                                className="block w-full text-left px-4 py-2.5 text-sm font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                Hire Candidate
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  updateStatus(app._id, "Rejected")
                                }
                                className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-gray-400 italic"
                >
                  No applications received yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;