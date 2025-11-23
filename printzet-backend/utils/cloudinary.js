import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload local file to Cloudinary
 */
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // handles pdf, docx, jpg, png etc.
    });

    // remove local file after uploading
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {

    // still delete file on error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("❌ Cloudinary Upload Error:", error);
    return null;
  }
};

/**
 * Delete a file from Cloudinary using its public_id
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.error("❌ Cloudinary Delete Error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
