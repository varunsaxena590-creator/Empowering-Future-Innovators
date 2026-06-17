const Faculty = require('../models/Faculty');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: faculty });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    let image = req.body.image || '';
    if (req.file) {
      const url = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'faculty');
      if (url) image = url;
    }
    const faculty = await Faculty.create({ ...req.body, image });
    res.status(201).json({ success: true, data: faculty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, data: faculty });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
