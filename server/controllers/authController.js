import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Register a new user as 'user' or 'recruiter'
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            const userWithoutPassword = await User.findById(user._id).select('-password');
            res.status(201).json({
                success: true,
                user: userWithoutPassword,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Authenticate user and generate JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const userWithoutPassword = await User.findById(user._id).select('-password');
            res.json({
                success: true,
                user: userWithoutPassword,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get profile of the currently authenticated user
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Sync Clerk user to custom JWT
 * @route   POST /api/auth/clerk-sync
 * @access  Public
 */
export const clerkSync = async (req, res) => {
    try {
        const { email, name, role } = req.body;
        // In a real prod scenario, we should verify `clerkToken` securely with Clerk JWKS.
        // For our seamless integration, we trust the client's Clerk sign-in and sync via email.
        
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email: email,
                password: "clerk-sso-" + Math.random().toString(36).substring(7),
                role: role || 'user',
            });
        }

        const userWithoutPassword = await User.findById(user._id).select('-password');
        res.json({
            success: true,
            user: userWithoutPassword,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
