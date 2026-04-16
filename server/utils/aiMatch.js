/**
 * Calculates a compatibility score between a candidate and a job.
 * @param {Object} user - The user object with skills and experience.
 * @param {Object} job - The job object with required skills and experience.
 * @returns {number} - Compatibility percentage (0-100).
 */
export const calculateSkillMatch = (user, job) => {
    if (!user || !job || !job.skillsRequired) return 0;
    
    const userSkills = user.skills?.map(s => s.toLowerCase()) || [];
    const jobSkills = job.skillsRequired?.map(s => s.toLowerCase()) || [];
    
    if (jobSkills.length === 0) return 100;
    
    const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
    
    const matchPercentage = Math.round((matchedSkills.length / jobSkills.length) * 100);
    
    // Add logic for experience matching if needed
    // For now, focus on skills as requested
    
    return matchPercentage;
};
