import Job from '../models/Job.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import fs from 'fs/promises';
import path from 'path';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getJobs = async (req, res) => {
  try {
    const { title, location, category, page = 1, limit = 12, sort = 'desc' } = req.query;
    const query = { isVisible: true };

    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('companyId', 'name email image')
      .sort({ date: sort === 'asc' ? 1 : -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      jobs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('companyId', 'name email image');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, category, location, level, salary } = req.body;

    if (!title || !description || !category || !location || !level || salary === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required job fields' });
    }

    const company = req.company;
    const job = await Job.create({
      title,
      description,
      category,
      location,
      level,
      salary: Number(salary),
      companyId: company._id,
    });

    return res.status(201).json({ success: true, message: 'Job created', job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobVisibility = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, companyId: req.company._id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.isVisible = req.body.isVisible;
    await job.save();

    return res.status(200).json({ success: true, message: 'Visibility updated', job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.company._id }).sort({ date: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId, resumeUrl } = req.body;

    if (!jobId || !userId || !resumeUrl) {
      return res.status(400).json({ success: false, message: 'Missing application details' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const existing = await Application.findOne({ jobId, userId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You already applied to this job' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const application = await Application.create({
      jobId,
      userId,
      companyId: job.companyId,
      resume: resumeUrl,
    });

    return res.status(201).json({ success: true, message: 'Application submitted', application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    const filePath = req.file.path;
    const url = await uploadToCloudinary(filePath);
    await fs.unlink(filePath);

    if (req.body.userId) {
      await User.findByIdAndUpdate(req.body.userId, { resume: url });
    }

    return res.status(200).json({ success: true, resumeUrl: url });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationsForUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User id is required' });
    }

    const applications = await Application.find({ userId })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name image' } })
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationsForCompany = async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.company._id })
      .populate({ path: 'jobId', select: 'title location' })
      .populate('userId', 'name email image')
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changeApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;
    if (!applicationId || !status) {
      return res.status(400).json({ success: false, message: 'Missing application status data' });
    }

    const application = await Application.findOne({ _id: applicationId, companyId: req.company._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ success: true, message: 'Application status updated', application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
