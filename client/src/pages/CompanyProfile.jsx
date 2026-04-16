import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/jobPortalContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CompanyProfile = () => {
    const { backendUrl, token } = useContext(AppContext);
    
    const [loading, setLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [logo, setLogo] = useState(null);
    const [preview, setPreview] = useState(null);
    
    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        description: '',
        website: '',
        location: '',
        industry: ''
    });

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/company/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.company) {
                setCompanyInfo(data.company);
                setPreview(data.company.logo);
            }
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', companyInfo.name);
            formData.append('description', companyInfo.description);
            formData.append('website', companyInfo.website);
            formData.append('location', companyInfo.location);
            formData.append('industry', companyInfo.industry);
            if (logo) formData.append('logo', logo);

            const { data } = await axios.post(`${backendUrl}/api/company/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success("Branding updated successfully!");
                setIsEdit(false);
                fetchProfile();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (token) fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    if (loading) return <div className="h-96 flex items-center justify-center font-bold text-gray-400">Loading Profile...</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500 transition-colors duration-300">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Company Identity</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Manage how your brand appears to potential candidates.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* Left Side: Logo & Quick Stats */}
                    <div className="w-full md:w-1/3 flex flex-col items-center gap-6 py-6 px-4 bg-gray-50 dark:bg-slate-800/50 rounded-[2rem]">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 shadow-inner flex items-center justify-center p-6 overflow-hidden">
                                {preview ? (
                                    <img src={preview} className="max-h-full max-w-full object-contain dark:invert opacity-80" alt="" />
                                ) : (
                                    <span className="text-gray-300 dark:text-gray-600 text-4xl font-black">{companyInfo.name?.[0] || '🏢'}</span>
                                )}
                            </div>
                            {isEdit && (
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white cursor-pointer rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xs font-bold uppercase">Change Logo</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                                </label>
                            )}
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{companyInfo.name || "Brand Name"}</h3>
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1">{companyInfo.industry || "Industry Not Set"}</p>
                        </div>
                        
                        <div className="w-full space-y-4 pt-4 border-t border-gray-200 dark:border-white/5">
                             <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-400 dark:text-gray-500">📍</span>
                                <span className="font-medium text-gray-600 dark:text-gray-400">{companyInfo.location || "Location Not Set"}</span>
                             </div>
                             <div className="flex items-center gap-3 text-sm">
                                <span className="text-gray-400 dark:text-gray-500">🌐</span>
                                <a href={companyInfo.website} target="_blank" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">{companyInfo.website?.replace(/^https?:\/\//, '') || "No website"}</a>
                             </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="flex-1 py-4">
                        {!isEdit ? (
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">About the Company</label>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        {companyInfo.description || "No description provided yet. Let candidates know what your company is about!"}
                                    </p>
                                </div>
                                <button onClick={() => setIsEdit(true)} className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 dark:shadow-none transition-all active:scale-95">Edit Company Profile</button>
                            </div>
                        ) : (
                             <form className="space-y-6" onSubmit={handleUpdate}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Company Name</label>
                                        <input className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 p-3 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white" defaultValue={companyInfo.name} onChange={e => setCompanyInfo(p=>({...p, name: e.target.value}))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Industry Type</label>
                                        <input className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 p-3 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white" placeholder="e.g. Technology, Finance" defaultValue={companyInfo.industry} onChange={e => setCompanyInfo(p=>({...p, industry: e.target.value}))} />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Location</label>
                                        <input className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 p-3 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white" defaultValue={companyInfo.location} onChange={e => setCompanyInfo(p=>({...p, location: e.target.value}))} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Website URL</label>
                                        <input className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 p-3 rounded-xl outline-none focus:border-blue-500 transition-all font-medium text-gray-900 dark:text-white" placeholder="https://example.com" defaultValue={companyInfo.website} onChange={e => setCompanyInfo(p=>({...p, website: e.target.value}))} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                                    <textarea className="w-full bg-white border border-gray-200 p-4 rounded-xl outline-none focus:border-blue-500 transition-all min-h-[150px] font-medium" defaultValue={companyInfo.description} onChange={e => setCompanyInfo(p=>({...p, description: e.target.value}))}></textarea>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Save Changes</button>
                                    <button type="button" onClick={() => setIsEdit(false)} className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
