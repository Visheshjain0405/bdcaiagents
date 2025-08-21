const mongoose = require('mongoose');

const organizationUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, required: true },
  joinDate: { type: Date, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  // Add other fields relevant to your organization user
});

const OrganizationUser = mongoose.model('OrganizationUser', organizationUserSchema);

module.exports = OrganizationUser;
