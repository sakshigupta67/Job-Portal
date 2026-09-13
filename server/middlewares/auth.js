import jwt from 'jsonwebtoken';
import { verifyToken } from '@clerk/backend';
import Company from '../models/Company.js';

export const protectCompany = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id).select('-password');

    if (!company) {
      return res.status(401).json({ success: false, message: 'Company not found' });
    }

    req.company = company;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const protectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!process.env.CLERK_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Clerk server authentication is not configured' });
    }

    const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
    req.user = { ...decoded, id: decoded.sub };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
