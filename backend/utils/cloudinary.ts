// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';
// import dotenv from 'dotenv';

// dotenv.config();

// // 1. Cloudinary Config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // 2. Storage Setup
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'news_portal_articles', // Cloudinary mein folder ka naam
//     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
//   } as any,
// });

// export const upload = multer({ storage: storage });


import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isResume = file.fieldname === 'resume';
    
    // Clean the filename: remove spaces and special characters
    const cleanFileName = file.originalname
      .split('.')[0]            // Get name before extension
      .replace(/\s+/g, '-')     // Replace all spaces with hyphens
      .trim();                  // Remove any trailing/leading whitespace

    return {
      folder: isResume ? 'portfolio_resumes' : 'portfolio_hero',
      resource_type: isResume ? 'raw' : 'image', 
      // Ensure the public_id is perfectly clean
      public_id: `${Date.now()}-${cleanFileName}`.trim(),
    };
  },
});

export const upload = multer({ storage });