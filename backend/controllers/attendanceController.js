const Attendance = require('../models/Attendance');

exports.getAttendance = async (req, res) => {
  try {
    const { course, date, status } = req.query;
    const query = {};
    if (course) query.course = course;
    if (status) query.status = status;
    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    }
    const records = await Attendance.find(query)
      .populate('course', 'title')
      .sort({ date: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const record = await Attendance.create({ ...req.body, markedBy: req.user._id });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = stats.reduce((sum, s) => sum + s.count, 0);
    res.json({ success: true, data: { stats, total } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
