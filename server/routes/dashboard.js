const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const expiredStudents = await Student.countDocuments({ status: 'Expired' });
    const expiringSoon = await Student.countDocuments({ status: 'Expiring Soon' });

    const monthlyIncome = await Student.aggregate([
      { $match: { paymentDate: { $gte: thisMonth, $lte: thisMonthEnd } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    const lastMonthIncome = await Student.aggregate([
      { $match: { paymentDate: { $gte: lastMonth, $lt: thisMonth } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    // Monthly admissions for chart (last 6 months)
    const admissionChart = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await Student.countDocuments({ admissionDate: { $gte: start, $lte: end } });
      const income = await Student.aggregate([
        { $match: { paymentDate: { $gte: start, $lte: end } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]);
      admissionChart.push({
        month: start.toLocaleString('default', { month: 'short' }) + ' ' + start.getFullYear(),
        admissions: count,
        income: income[0]?.total || 0
      });
    }

    // Recent notifications
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringStudents = await Student.find({
      expiryDate: { $gte: now, $lte: sevenDaysLater }
    }).select('name seatNo expiryDate phone').limit(10);

    const recentlyExpired = await Student.find({
      expiryDate: { $gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), $lt: now }
    }).select('name seatNo expiryDate phone').limit(10);

    const recentAdmissions = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name seatNo plan admissionDate');

    const totalIncome = await Student.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ]);

    res.json({
      totalStudents,
      activeStudents,
      expiredStudents,
      expiringSoon,
      monthlyIncome: monthlyIncome[0]?.total || 0,
      lastMonthIncome: lastMonthIncome[0]?.total || 0,
      totalIncome: totalIncome[0]?.total || 0,
      admissionChart,
      notifications: {
        expiringStudents,
        recentlyExpired,
        recentAdmissions
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Payment history
router.get('/payments', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = {};
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      query.paymentDate = { $gte: start, $lte: end };
    }
    const payments = await Student.find(query)
      .select('name seatNo plan amountPaid paymentDate admissionDate expiryDate status')
      .sort({ paymentDate: -1 });

    const totalAmount = payments.reduce((sum, p) => sum + p.amountPaid, 0);
    res.json({ payments, totalAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
