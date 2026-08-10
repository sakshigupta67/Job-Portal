import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
      return res.status(400).json({ success: false, message: 'Missing details' });
    }

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(409).json({ success: false, message: 'Company already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageFile.filename ? `/uploads/${imageFile.filename}` : imageFile.path,
    });

    return res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      token: generateToken(company._id),
      company: { _id: company._id, name: company.name, email: company.email, image: company.image },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(company._id),
      company: { _id: company._id, name: company.name, email: company.email, image: company.image },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyData = async (req, res) => {
  try {
    return res.status(200).json({ success: true, company: req.company });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const postJob = async (req, res) => {
  try {
    const { title, description, category, location, level, salary } = req.body;
    if (!title || !description || !category || !location || !level || salary === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required job fields' });
    }

    const job = await Job.create({
      title,
      description,
      category,
      location,
      level,
      salary: Number(salary),
      companyId: req.company._id,
    });

    return res.status(201).json({ success: true, message: 'Job created', job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyJobApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.company._id })
      .populate('jobId', 'title location')
      .populate('userId', 'name email image')
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCompanyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.company._id }).sort({ date: -1 });
    return res.status(200).json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const changeJobApplicationsStatus = async (req, res) => {
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

export const changeVisibility = async (req, res) => {
  try {
    const { jobId, isVisible } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Job id is required' });
    }

    const job = await Job.findOne({ _id: jobId, companyId: req.company._id });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.isVisible = isVisible;
    await job.save();

    return res.status(200).json({ success: true, message: 'Visibility updated', job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

