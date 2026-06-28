const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');
const { cloudinary, uploadGallery } = require('../config/cloudinary');

// GET public settings (no auth needed)
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all settings (admin)
router.get('/', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update timing
router.put('/timing', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    settings.libraryTiming = { ...settings.libraryTiming, ...req.body };
    await settings.save();
    res.json(settings.libraryTiming);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update contact info
router.put('/contact', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    settings.contactInfo = { ...settings.contactInfo, ...req.body };
    await settings.save();
    res.json(settings.contactInfo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fee Plans CRUD
router.get('/fee-plans', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings.feePlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/fee-plans', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    settings.feePlans.push(req.body);
    await settings.save();
    res.json(settings.feePlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/fee-plans/:planId', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const plan = settings.feePlans.id(req.params.planId);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    Object.assign(plan, req.body);
    await settings.save();
    res.json(settings.feePlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/fee-plans/:planId', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    settings.feePlans.pull({ _id: req.params.planId });
    await settings.save();
    res.json(settings.feePlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Gallery
router.post('/gallery', auth, (req, res) => {
  uploadGallery.single('image')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      const settings = await Settings.findOne();
      settings.galleryImages.push({
        url: req.file.path,
        publicId: req.file.filename,
        caption: req.body.caption || ''
      });
      await settings.save();
      res.json(settings.galleryImages);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  });
});

router.delete('/gallery/:imageId', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const img = settings.galleryImages.id(req.params.imageId);
    if (!img) return res.status(404).json({ message: 'Image not found' });
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    settings.galleryImages.pull({ _id: req.params.imageId });
    await settings.save();
    res.json(settings.galleryImages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
