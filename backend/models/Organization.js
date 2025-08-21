// backend/models/Organization.js
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  officialName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  organizationType: { type: String, required: true },
  registeredCountry: { type: String, required: true },
  pointOfContact: { type: String, required: true },
  pocEmail: { type: String, required: true },
  pocMobile: { type: String, required: true },
  pocCountryCode: { type: String, default: '+91' },
  whatsappNumber: { type: String },
  whatsappCountryCode: { type: String, default: '+91' },
  planType: { type: String, required: true },
  businessArea: { type: String, required: true },
  listOfServices: { type: String, required: true },
  gstin: { type: String },
  pan: { type: String },
  website: { type: String },
  credentials: {
  userId: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}

}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
