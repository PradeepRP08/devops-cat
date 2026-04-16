import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AppContext } from '../context/jobPortalContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { userData, backendUrl, token, fetchUserData } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: '',
    phone: '',
    location: '',
    education: [],
    experience: [],
    skills: [],
    links: { github: '', linkedin: '', portfolio: '' },
    preferences: { role: '', location: '', expectedSalary: 0 }
  });

  const [resume, setResume] = useState(null);
  const [image, setImage] = useState(null);

  const handleQuickLook = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  useEffect(() => {
    if (userData) {
      setProfileData({
        bio: userData.bio || '',
        phone: userData.phone || '',
        location: userData.location || '',
        education: userData.education || [],
        experience: userData.experience || [],
        skills: userData.skills || [],
        links: userData.links || { github: '', linkedin: '', portfolio: '' },
        preferences: userData.preferences || { role: '', location: '', expectedSalary: 0 }
      });
    }
  }, [userData]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('bio', profileData.bio);
      formData.append('phone', profileData.phone);
      formData.append('location', profileData.location);
      formData.append('education', JSON.stringify(profileData.education));
      formData.append('experience', JSON.stringify(profileData.experience));
      formData.append('skills', profileData.skills.join(','));
      formData.append('links', JSON.stringify(profileData.links));
      formData.append('preferences', JSON.stringify(profileData.preferences));
      if (resume) formData.append('resume', resume);
      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Profile updated successfully");
        setIsEdit(false);
        fetchUserData();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const calculateCompletion = () => {
    if (!userData) return 0;
    const fields = [userData.bio, userData.phone, userData.location, userData.education?.length, userData.experience?.length, userData.skills?.length, userData.resume];
    const filled = fields.filter(f => f && f !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  if (!userData) return <div className="p-20 text-center">Loading Profile...</div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="container px-4 sm:px-8 2xl:px-20 mx-auto py-12 max-w-5xl">
        
        {/* Profile Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-white/5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-5xl font-black uppercase shadow-xl shadow-blue-200 overflow-hidden">
                        {userData.image ? <img src={userData.image} className="w-full h-full object-cover" alt="" /> : userData.name[0]}
                    </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1">{userData.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{userData.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                        {userData.skills?.slice(0, 5).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800">{skill}</span>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-64">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profile Completion</span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">{calculateCompletion()}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                        <div className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-1000" style={{ width: `${calculateCompletion()}%` }}></div>
                    </div>
                    <button 
                        onClick={() => setIsEdit(!isEdit)}
                        className="w-full mt-6 py-3 rounded-2xl font-bold transition-all border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                        {isEdit ? "Cancel Editing" : "Edit Full Profile"}
                    </button>
                </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Summary & Links */}
            <div className="space-y-8 h-fit">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Contact & Socials</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center"><img className="w-4 opacity-50 dark:invert" src={assets.location_icon} alt="" /></div>
                            <div><p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Location</p><p className="text-sm font-bold text-gray-700 dark:text-gray-300">{userData.location || 'Not set'}</p></div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center"><img className="w-4 opacity-50 dark:invert" src={assets.phone_icon} alt="" /></div>
                            <div><p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone</p><p className="text-sm font-bold text-gray-700 dark:text-gray-300">{userData.phone || 'Not set'}</p></div>
                        </div>
                        <hr className="border-gray-50 dark:border-white/5" />
                        <div className="space-y-4">
                             <a href={userData.links?.linkedin} target="_blank" className="flex items-center gap-4 group">
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">LinkedIn Profile</span>
                                <img className="w-3 opacity-30 dark:invert ml-auto" src={assets.right_arrow_icon} alt="" />
                             </a>
                             <a href={userData.links?.github} target="_blank" className="flex items-center gap-4 group">
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">GitHub Repository</span>
                                <img className="w-3 opacity-30 dark:invert ml-auto" src={assets.right_arrow_icon} alt="" />
                             </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Experience, Education, Bio */}
            <div className="lg:col-span-2 space-y-8">
                {isEdit ? (
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-blue-100 dark:border-blue-900/40 shadow-xl shadow-blue-50/50 dark:shadow-none animate-in slide-in-from-top-4">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 pb-4 border-b border-gray-100 dark:border-white/5">Profile Editor</h2>
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Professional Bio</label>
                                <textarea 
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 transition-all text-sm h-32 text-gray-900 dark:text-white"
                                    value={profileData.bio}
                                    onChange={e => setProfileData(p => ({...p, bio: e.target.value}))}
                                    placeholder="Tell companies about yourself..."
                                />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone Number</label>
                                    <input className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none" value={profileData.phone} onChange={e => setProfileData(p => ({...p, phone: e.target.value}))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Location</label>
                                    <input className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl p-3 text-sm text-gray-900 dark:text-white outline-none" value={profileData.location} onChange={e => setProfileData(p => ({...p, location: e.target.value}))} />
                                </div>
                             </div>
                             <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Work Experience</label>
                                    <button type="button" onClick={() => setProfileData(p => ({...p, experience: [...p.experience, { company: '', role: '', duration: '', description: '' }]}))} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">+ Add Entry</button>
                                </div>
                                {profileData.experience.map((exp, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3 relative group">
                                        <button type="button" onClick={() => setProfileData(p => ({...p, experience: p.experience.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors">✕</button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input placeholder="Company" className="bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-sm py-1 font-bold text-gray-900 dark:text-white" value={exp.company} onChange={e => {
                                                const newExp = [...profileData.experience];
                                                newExp[i].company = e.target.value;
                                                setProfileData(p => ({...p, experience: newExp}));
                                            }} />
                                            <input placeholder="Role" className="bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-sm py-1 font-bold text-gray-900 dark:text-white" value={exp.role} onChange={e => {
                                                const newExp = [...profileData.experience];
                                                newExp[i].role = e.target.value;
                                                setProfileData(p => ({...p, experience: newExp}));
                                            }} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input placeholder="Duration (e.g. 2020 - 2022)" className="bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-xs py-1 text-gray-500 dark:text-gray-400" value={exp.duration} onChange={e => {
                                                const newExp = [...profileData.experience];
                                                newExp[i].duration = e.target.value;
                                                setProfileData(p => ({...p, experience: newExp}));
                                            }} />
                                        </div>
                                        <textarea placeholder="Description" className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-xs py-1 text-gray-500 dark:text-gray-400 h-16 resize-none" value={exp.description} onChange={e => {
                                            const newExp = [...profileData.experience];
                                            newExp[i].description = e.target.value;
                                            setProfileData(p => ({...p, experience: newExp}));
                                        }} />
                                    </div>
                                ))}
                             </div>

                             <div className="space-y-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Education</label>
                                    <button type="button" onClick={() => setProfileData(p => ({...p, education: [...p.education, { institution: '', degree: '', startYear: '', endYear: '' }]}))} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">+ Add Entry</button>
                                </div>
                                {profileData.education.map((edu, i) => (
                                    <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3 relative group">
                                        <button type="button" onClick={() => setProfileData(p => ({...p, education: p.education.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors">✕</button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input placeholder="Institution" className="bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-sm py-1 font-bold text-gray-900 dark:text-white" value={edu.institution} onChange={e => {
                                                const newEdu = [...profileData.education];
                                                newEdu[i].institution = e.target.value;
                                                setProfileData(p => ({...p, education: newEdu}));
                                            }} />
                                            <input placeholder="Degree" className="bg-transparent border-b border-gray-200 dark:border-white/10 outline-none text-sm py-1 font-bold text-gray-900 dark:text-white" value={edu.degree} onChange={e => {
                                                const newEdu = [...profileData.education];
                                                newEdu[i].degree = e.target.value;
                                                setProfileData(p => ({...p, education: newEdu}));
                                            }} />
                                        </div>
                                    </div>
                                ))}
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Update Resume (PDF)</label>
                                    <div className="flex items-center gap-3">
                                        <input type="file" accept=".pdf" className="w-full text-xs" onChange={e => setResume(e.target.files[0])} />
                                        {resume && (
                                            <button 
                                                type="button"
                                                onClick={() => handleQuickLook(resume)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-bold hover:bg-blue-100 transition-all text-[10px] whitespace-nowrap"
                                            >
                                                Quick Look ✨
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Profile Photo</label>
                                    <input type="file" accept="image/*" className="w-full text-xs" onChange={e => setImage(e.target.files[0])} />
                                </div>
                             </div>
                             
                             <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex gap-4">
                                <button onClick={handleUpdate} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200/50">Save Changes</button>
                                <button onClick={() => setIsEdit(false)} className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-bold">Discard</button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                Personal Summary
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {userData.bio || "No bio added yet. Tell recruiters about your journey and achievements."}
                            </p>
                        </div>

                        {userData.role === 'user' && (
                            <>
                                <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                                        Work Experience
                                    </h3>
                                    {userData.experience?.length > 0 ? userData.experience.map((exp, i) => (
                                        <div key={i} className="mb-10 pl-6 border-l-2 border-indigo-50 dark:border-indigo-900 absolute relative group">
                                            <div className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-[9px] top-1 ring-4 ring-indigo-50 dark:ring-indigo-900/40 group-hover:scale-125 transition-transform"></div>
                                            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-1">{exp.role}</h4>
                                            <p className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-2">{exp.company} • {exp.duration}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{exp.description}</p>
                                        </div>
                                    )) : <p className="text-gray-400 dark:text-gray-500 italic font-medium">No experience listed. Add your career history to boost visibility.</p>}
                                </div>

                                <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                                        Resume Content
                                    </h3>
                                    <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-900 dark:text-purple-300 font-bold">Curated Resume</p>
                                            <p className="text-xs text-purple-600 dark:text-purple-500 font-medium">Last updated: {userData.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <a href={userData.resume} className="px-6 py-2 bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 rounded-xl font-bold shadow-sm hover:shadow-md transition-shadow">Download PDF</a>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
