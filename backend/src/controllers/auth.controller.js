import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { generateToken } from '../config/jwt.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check which model to use based on role
    const Model = role === 'ADMIN' ? Admin : User;
    const modelName = role === 'ADMIN' ? 'Admin' : 'User';

    // Check if user/admin already exists
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `${modelName} with this email already exists`,
      });
    }

    // Create new user/admin
    const newUser = await Model.create({
      name,
      email,
      password,
      role: role || 'USER',
    });

    // Generate JWT token
    const token = generateToken({ 
      id: newUser._id, 
      role: newUser.role 
    });

    res.status(201).json({
      success: true,
      message: `${modelName} registered successfully`,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * @desc    Login user/admin
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check in both Admin and User collections
    let user = await Admin.findOne({ email }).select('+password');
    let role = 'ADMIN';

    if (!user) {
      user = await User.findOne({ email }).select('+password');
      role = 'USER';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = generateToken({ 
      id: user._id, 
      role: user.role 
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const Model = req.user.role === 'ADMIN' ? Admin : User;
    const user = await Model.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};
