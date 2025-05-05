import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
    api_key: process.env.CLOUDNARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET 
});

const uploadCloudnary = async (localfilepath) => {
    try {
        if (!localfilepath) return null; // Fix condition

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        });

        // ✅ Delete the file after successful upload
        fs.unlink(localfilepath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            } else {
                console.log("Local file deleted successfully.");
            }
        });

        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);

        // ✅ Delete file only if it exists, with error handling
        fs.unlink(localfilepath, (err) => {
            if (err) {
                console.error("Error deleting local file after failure:", err);
            }
        });

        return null;
    }
};

export { uploadCloudnary };
