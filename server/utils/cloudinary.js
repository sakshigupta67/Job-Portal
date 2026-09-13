import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadToCloudinary = async (filePath) => {
  if (!hasCloudinaryConfig) {
    return `/uploads/${path.basename(filePath)}`;
  }

  const extension = path.extname(filePath).toLowerCase();
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'job-portal',
    resource_type: extension === '.pdf' ? 'raw' : 'auto',
  });

  return result.secure_url;
};

export default cloudinary;
