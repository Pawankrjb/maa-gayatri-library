const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports'));

// Health check
app.get('/', (req, res) => {
  res.send('Maa Gayatri Library API is running!');
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Maa Gayatri Library API Running' }));

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/maa-gayatri-library')
  .then(async () => {
    console.log('MongoDB Connected');
    
    // Seed admin if not exists
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    const existing = await Admin.findOne({ email: 'admin@maagayatri.com' });
    if (!existing) {
      const hash = await bcrypt.hash('Admin@123', 10);
      await Admin.create({ email: 'admin@maagayatri.com', password: hash, name: 'Admin' });
      console.log('Default admin created: admin@maagayatri.com / Admin@123');
    }

    // Seed default settings
    const Settings = require('./models/Settings');
    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        libraryTiming: { openTime: '6:00 AM', closeTime: '10:00 PM', days: 'Monday to Sunday' },
        feePlans: [
          { name: '1 Month', duration: 1, price: 700, description: 'Basic monthly plan' },
          { name: '3 Months', duration: 3, price: 1900, description: 'Quarterly plan - Save ₹200' },
          { name: '6 Months', duration: 6, price: 3500, description: 'Semi-annual plan - Save ₹700' },
          { name: '1 Year', duration: 12, price: 6000, description: 'Annual plan - Best Value' }
        ],
        contactInfo: {
          phone: '+91 98765 43210',
          whatsapp: '+91 98765 43210',
          address: 'Shanti Nagar, Balti Factory, Near Main Road',
          city: 'Ludhiana, Punjab',
          email: 'info@maagayatrilibrary.com'
        },
        galleryImages: []
      });
      console.log('Default settings created');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Cron job: Update student status daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const Student = require('./models/Student');
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await Student.updateMany(
      { expiryDate: { $lt: now }, status: { $ne: 'Expired' } },
      { status: 'Expired' }
    );
    await Student.updateMany(
      { expiryDate: { $gte: now, $lte: sevenDaysLater }, status: 'Active' },
      { status: 'Expiring Soon' }
    );
    await Student.updateMany(
      { expiryDate: { $gt: sevenDaysLater }, status: { $ne: 'Active' } },
      { status: 'Active' }
    );
    console.log('Student statuses updated');
  } catch (err) {
    console.error('Cron error:', err);
  }
});
