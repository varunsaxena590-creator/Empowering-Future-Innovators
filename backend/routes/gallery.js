/**
 * @file routes/gallery.js
 * @description Gallery image management API routes.
 *
 * GET    /api/gallery       — Get images by category (public)
 * POST   /api/gallery       — Upload image to Cloudinary (admin)
 * PUT    /api/gallery/:id   — Update image metadata (admin)
 * DELETE /api/gallery/:id   — Delete image (admin)
 */
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { uploadGallery } = require('../config/cloudinary');
const { getGallery, uploadImage, updateImage, deleteImage } = require('../controllers/galleryController');

router.get('/', getGallery);
router.post('/', protect, adminOnly, uploadGallery.single('image'), uploadImage);
router.put('/:id', protect, adminOnly, updateImage);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
