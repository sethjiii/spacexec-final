const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Cloudinary Config
cloudinary.config({
  cloud_name: 'dtucbqemb',
  api_key: '564449158238396',
  api_secret: 'EV3SzT3ZxzW7pfsC2OXJBJm4afA',
});

// Function to upload image to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.buffer, // Upload the file buffer
      {
        folder: 'uploads', // Your Cloudinary folder
        resource_type: 'auto', // Automatically detect the file type (image, video, etc.)
        public_id: file.originalname.split('.')[0], // Optional: custom public ID
      },
      (error, result) => {
        if (error) {
          reject(error); // Handle any errors
        } else {
          resolve(result); // Return the result (Cloudinary URL, etc.)
        }
      }
    );
  });
};

// Multer configuration to store files in memory
const storage = multer.memoryStorage(); // Files are stored in memory

// File type filter to accept only specific file types (images, PDFs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'), false);
  }
};

// Multer instance to handle file uploads
const uploadFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
}).array('images', 10); // Accept up to 10 files at once (adjust as needed)

// Middleware to handle file uploads to Cloudinary
const handleFileUpload = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const uploadedImages = [];

    // Loop through each file, upload it to Cloudinary, and store the URLs
    for (const file of req.files) {
      const result = await uploadToCloudinary(file);
      console.log('Uploaded image URL:', result.secure_url); // Cloudinary URL for the uploaded image
      uploadedImages.push(result.secure_url); // Store the image URL
    }

    // Attach the uploaded image URLs to the request object for later use
    req.uploadedImages = uploadedImages;
    next(); // Proceed to the next middleware or route handler

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Error uploading files to Cloudinary' });
  }
};

module.exports = { uploadFiles, handleFileUpload };
