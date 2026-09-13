import fs from 'fs/promises';
import User from '../models/User.js';
import Application from '../models/Application.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    // Ensure the authenticated user can only update their own resume
    const tokenUserId = req.user?.id || req.user?.sub;
    if (tokenUserId && tokenUserId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: cannot update another user\'s resume' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resumeUrl = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    user.resume = resumeUrl;
    await user.save();
    await Application.updateMany({ userId: req.params.id }, { $set: { resume: resumeUrl } });

    return res.status(200).json({ success: true, message: 'Resume updated', resumeUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};