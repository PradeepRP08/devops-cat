import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "node:fs";
import path from "node:path";
dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer directly to Cloudinary using a stream.
 * Ideal for Multer's memoryStorage.
 * @param {Buffer} buffer - File buffer from req.file.buffer
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadFromBuffer = (buffer, folder = 'job-portal', originalName = null) => {
  return new Promise((resolve, reject) => {
    // If the user hasn't set up a real Cloudinary account, fallback to local storage
    if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === '123456789') {
      try {
        const localFolder = path.join(process.cwd(), 'uploads', folder);
        if (!fs.existsSync(localFolder)) {
          fs.mkdirSync(localFolder, { recursive: true });
        }
        
        const cleanName = (originalName || 'file').replace(/[^a-zA-Z0-9.\-_]/g, '_');
        const uniqueName = `${Date.now()}-${cleanName}`;
        const filePath = path.join(localFolder, uniqueName);
        
        fs.writeFileSync(filePath, buffer);
        
        const relativePath = `/uploads/${folder}/${uniqueName}`;
        console.log(`[STORAGE] File saved locally: ${relativePath}`);
        return resolve(relativePath);
      } catch (err) {
        console.error(`[STORAGE ERROR] Local upload failed:`, err);
        return reject(err);
      }
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

export default cloudinary;
