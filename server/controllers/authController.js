import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, course, year } = req.body;

    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone,
      course,
      year
    });

    if (user) {
      // Generate Token
      const token = generateToken(res, user._id);
      
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roomId: user.roomId,
        phone: user.phone,
        course: user.course,
        profileImage: user.profileImage,
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate Token
      const token = generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roomId: user.roomId,
        phone: user.phone,
        course: user.course,
        profileImage: user.profileImage,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get user profile (Example of a protected route)
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching profile', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.course = req.body.course || user.course;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        course: updatedUser.course,
        roomId: updatedUser.roomId,
        profileImage: updatedUser.profileImage,
        token: generateToken(res, updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile', error: error.message });
  }
};

// @desc    Upload user profile image
// @route   POST /api/auth/profile/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Function to upload stream to cloudinary
    const uploadStream = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'hostelsys/profiles',
            width: 500,
            height: 500,
            crop: 'fill',
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await uploadStream(req.file.buffer);

    // If user already has an image, we could delete it from cloudinary
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`hostelsys/profiles/${publicId}`);
      } catch (err) {
        console.error('Error deleting old profile image:', err);
      }
    }

    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// @desc    Delete user profile image
// @route   DELETE /api/auth/profile/image
// @access  Private
export const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.profileImage) {
      return res.status(400).json({ message: 'No profile image to delete' });
    }

    const publicId = user.profileImage.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`hostelsys/profiles/${publicId}`);

    user.profileImage = '';
    await user.save();

    res.status(200).json({ message: 'Profile image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
};
