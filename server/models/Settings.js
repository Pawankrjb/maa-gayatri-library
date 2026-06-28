const mongoose = require('mongoose');

const feePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  isPopular: { type: Boolean, default: false }
});

const settingsSchema = new mongoose.Schema({
  libraryTiming: {
    openTime: { type: String, default: '6:00 AM' },
    closeTime: { type: String, default: '10:00 PM' },
    days: { type: String, default: 'Monday to Sunday' },
    notes: { type: String, default: '' }
  },
  feePlans: [feePlanSchema],
  contactInfo: {
    phone: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    email: { type: String, default: '' },
    mapEmbed: { type: String, default: '' }
  },
  galleryImages: [{ url: String, publicId: String, caption: String }]
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
