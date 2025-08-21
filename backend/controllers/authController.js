// --- backend/controllers/authController.js ---
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

exports.loginUser = async (req, res) => {
    const { id, password } = req.body;
    console.log(id, password)
    try {
        const user = await User.findOne({ username: id });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = generateToken(user);

       // Send back user data with token and organizationId
        res.status(200).json({
            success: true,
            token,
            userType: user.role,
            organizationId: user.organizationId,  // Include organizationId in the response
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};