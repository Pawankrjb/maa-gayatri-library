const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const makeStorage = (folder) => new CloudinaryStorage({
  cloudinary,
  params: { folder, allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'] }
});

module.exports = {
  cloudinary,
  uploadStudentPhoto: multer({ storage: makeStorage('maa-gayatri/students') }),
  uploadIdProof:     multer({ storage: makeStorage('maa-gayatri/id-proofs') }),
  uploadGallery:     multer({ storage: makeStorage('maa-gayatri/gallery') })
};
