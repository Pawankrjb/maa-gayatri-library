const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

// Get report data
router.get('/students', auth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/income', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.paymentDate = { $gte: start, $lte: end };
    }
    const students = await Student.find(query)
      .select('name seatNo plan amountPaid paymentDate status')
      .sort({ paymentDate: -1 });
    const total = students.reduce((sum, s) => sum + s.amountPaid, 0);
    res.json({ students, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/expired', auth, async (req, res) => {
  try {
    const students = await Student.find({ status: 'Expired' }).sort({ expiryDate: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
