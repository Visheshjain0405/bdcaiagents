// --- backend/models/User.js ---
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['super_user', 'orgadmin', 'orguser'], default: 'orguser' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);