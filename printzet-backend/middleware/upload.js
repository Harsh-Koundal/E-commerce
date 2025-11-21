import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Ensure PDFs & DOCX files are stored as `raw`
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "user_uploads",
      format: file.originalname.split(".").pop(), // Keep original format
      resource_type: "raw", // ✅ Ensure it's stored as raw
    };
  },
});

const upload = multer({
  storage, limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

export default upload;