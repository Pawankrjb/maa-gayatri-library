const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  aadhaar: { type: String },
  seatNo: { type: String, required: true },
  plan: { type: String, required: true },
  duration: { type: Number, required: true }, // in months
  amountPaid: { type: Number, required: true },
  admissionDate: { type: Date, required: true, default: Date.now },
  paymentDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Expired', 'Expiring Soon'], default: 'Active' },
  photo: { type: String, default: '' },
  photoPublicId: { type: String, default: '' },
  idProof: { type: String, default: '' },
  idProofPublicId: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

// Virtual: remainingDays
studentSchema.virtual('remainingDays').get(function() {
  const now = new Date();
  const diff = this.expiryDate - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Student', studentSchema);
