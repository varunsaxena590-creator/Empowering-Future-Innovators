const Gallery = require('../models/Gallery');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getGallery = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const query = {};
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.featured = true;
    const images = await Gallery.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    let url = req.body.url || '';
    let publicId = '';
    if (req.file) {
      const uploadedUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'gallery');
      if (uploadedUrl) url = uploadedUrl;
    }
    if (!url) return res.status(400).json({ success: false, message: 'Image URL or file is required' });
    const image = await Gallery.create({ ...req.body, url, publicId });
    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
