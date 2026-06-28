const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const { cloudinary, uploadStudentPhoto, uploadIdProof } = require('../config/cloudinary');
const multer = require('multer');

// Helper: Calculate expiry date
const calcExpiry = (admissionDate, duration) => {
  const d = new Date(admissionDate);
  d.setMonth(d.getMonth() + parseInt(duration));
  return d;
};

// Helper: Get status
const getStatus = (expiryDate) => {
  const now = new Date();
  const diff = expiryDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return 'Expired';
  if (days <= 7) return 'Expiring Soon';
  return 'Active';
};

// GET all students
router.get('/', auth, async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { seatNo: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'All') query.status = status;

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ students, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add student
router.post('/', auth, async (req, res) => {
  try {
    const { name, fatherName, phone, address, aadhaar, seatNo, plan, duration, amountPaid, admissionDate, notes } = req.body;
    const expiryDate = calcExpiry(admissionDate || new Date(), duration);
    const status = getStatus(expiryDate);

    const student = new Student({
      name, fatherName, phone, address, aadhaar, seatNo, plan, duration,
      amountPaid, admissionDate: admissionDate || new Date(),
      expiryDate, status, notes
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update student
router.put('/:id', auth, async (req, res) => {
  try {
    const { duration, admissionDate, ...rest } = req.body;
    const expiryDate = calcExpiry(admissionDate || new Date(), duration || 1);
    const status = getStatus(expiryDate);

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { ...rest, duration, admissionDate, expiryDate, status },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (student.photoPublicId) await cloudinary.uploader.destroy(student.photoPublicId);
    if (student.idProofPublicId) await cloudinary.uploader.destroy(student.idProofPublicId);

    await student.deleteOne();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST upload student photo
router.post('/:id/photo', auth, (req, res) => {
  uploadStudentPhoto.single('photo')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      if (student.photoPublicId) await cloudinary.uploader.destroy(student.photoPublicId);
      student.photo = req.file.path;
      student.photoPublicId = req.file.filename;
      await student.save();
      res.json({ photo: student.photo });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
});

// POST upload ID proof
router.post('/:id/idproof', auth, (req, res) => {
  uploadIdProof.single('idProof')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      if (student.idProofPublicId) await cloudinary.uploader.destroy(student.idProofPublicId);
      student.idProof = req.file.path;
      student.idProofPublicId = req.file.filename;
      await student.save();
      res.json({ idProof: student.idProof });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
});

module.exports = router;
