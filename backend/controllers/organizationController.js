// backend/controllers/organizationController.js
const Organization = require('../models/Organization');
const User = require('../models/User');
const sendEmail = require('../utils/emailSender');
const bcrypt = require('bcryptjs');

// Email template function with inline CSS
// Email template function with inline CSS and dynamic values
const createEmailTemplate = (orgData, credentials) => {
  const {
    officialName,
    organizationType,
    planType,
    businessArea,
    address,
    city,
    state,
    registeredCountry,
    pointOfContact,
    pocEmail
  } = orgData;

  const { userId, password } = credentials;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Organization Account Created</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc; color: #334155;">
    <table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f8fafc">
      <tr>
        <td align="center" valign="top">
          <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td bgcolor="#4f46e5" style="padding: 40px 30px; text-align: center; color: white;">
                <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; margin-bottom: 20px;">
                  <svg width="30" height="30" fill="currentColor" viewBox="0 0 24 24" style="vertical-align: middle;">
                    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                </div>
                <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 8px 0;">Account Created Successfully</h1>
                <p style="font-size: 16px; margin: 0;">Welcome to our organization management platform</p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 40px 30px;">
                <p style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Hello ${pointOfContact},</p>
                <p style="font-size: 16px; margin-bottom: 30px; line-height: 1.7;">We're excited to inform you that your organization account has been successfully created on our platform. Your organization is now ready to access all the features and services we provide.</p>

                <!-- Organization Details Card -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 12px; margin-bottom:25px; padding: 20px 25px; border-left: 4px solid #4f46e5; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                  <tr>
                    <td colspan="2" style="padding-bottom: 15px;">
                      <h2 style="margin: 0; font-size: 18px; color: #0f172a; display: flex; align-items: center;">
                        <svg width="18" height="18" fill="currentColor" style="margin-right: 8px;" viewBox="0 0 24 24">
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        Organization Details
                      </h2>
                    </td>
                  </tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Organization Name:</td><td style="text-align: right; font-weight: bold;">${officialName}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Organization Type:</td><td style="text-align: right; font-weight: bold;">${organizationType}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Plan Type:</td><td style="text-align: right; font-weight: bold;">${planType}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Business Area:</td><td style="text-align: right; font-weight: bold;">${businessArea}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Location:</td><td style="text-align: right; font-weight: bold;">${city}, ${state}, ${registeredCountry}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: 500;">Contact Email:</td><td style="text-align: right; font-weight: bold;">${pocEmail}</td></tr>
                </table>

                <!-- Credentials Card -->
                <table width="100%" cellpadding="10" cellspacing="0" bgcolor="#dcfce7" style="border: 2px solid #22c55e; border-radius: 12px; margin-bottom: 30px;">
                  <tr><td align="center">
                    <h3 style="color: #166534; font-size: 20px; font-weight: bold; margin-bottom: 20px;">Your Login Credentials</h3>
                    <table width="100%" cellpadding="10" cellspacing="0">
                      <tr>
                        <td width="50%" style="text-align: center;">
                          <div style="font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 8px;">User ID</div>
                          <div style="font-size: 16px; font-weight: bold; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">${userId}</div>
                        </td>
                        <td width="50%" style="text-align: center;">
                          <div style="font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 8px;">Password</div>
                          <div style="font-size: 16px; font-weight: bold; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">${password}</div>
                        </td>
                      </tr>
                    </table>
                  </td></tr>
                </table>

                <!-- Security Notice -->
                <table width="100%" cellpadding="15" cellspacing="0" bgcolor="#fef3c7" style="border: 1px solid #f59e0b; border-radius: 8px; margin-bottom: 30px;">
                  <tr><td>
                    <h4 style="color: #92400e; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Important Security Information</h4>
                    <p style="color: #92400e; font-size: 13px;">Please keep your credentials secure. Change your password after logging in for better security.</p>
                  </td></tr>
                </table>

                <!-- CTA Button -->
                <div style="text-align: center; margin-bottom: 30px;">
                                  <a href="https://bdcaiagents.vercel.app/" style="background: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Login to Your Account</a>

                 </div>

                <p style="font-size: 16px; line-height: 1.7;">If you have any questions or need help, feel free to contact our support team.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td bgcolor="#1e293b" style="padding: 30px; text-align: center; color: white;">
                <p style="margin: 0;">© 2025 Your Company Name. All rights reserved.</p>
                <p style="margin: 0;">This email was sent to ${pocEmail}</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};


const addOrganization = async (req, res) => {
    try {
        const organization = new Organization(req.body);
        await organization.save();
        res.status(201).json({ message: 'Organization added successfully', organization });
    } catch (error) {
        console.error('Error saving organization:', error);
        res.status(500).json({ message: 'Failed to save organization', error });
    }
};

// View all organizations
const getAllOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find().sort({ createdAt: -1 });
        res.status(200).json(orgs);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch organizations' });
    }
};

const updateOrganization = async (req, res) => {
    try {
        const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error });
    }
};

const deleteOrganization = async (req, res) => {
    try {
        await Organization.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error });
    }
};

const saveCredentials = async (req, res) => {
    const { userId, password } = req.body;
    const { id } = req.params;

    try {
        const org = await Organization.findById(id);
        if (!org) return res.status(404).json({ message: 'Organization not found' });

        // Save credentials to organization model
        org.credentials = {
            userId,
            password, // Consider removing this after storing in User collection
            createdAt: org.credentials?.createdAt || new Date(),
            updatedAt: new Date()
        };
        await org.save();

        // Check if user already exists
        const existingUser = await User.findOne({ username: userId });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user account
        const newUser = new User({
            username: userId,
            password: hashedPassword,
            role: 'orgadmin',
            organizationId: org._id // Optional: Add this field in User schema
        });

        await newUser.save();

        // Create the HTML email template
        const htmlContent = createEmailTemplate(org, { userId, password });

        // Send email
        await sendEmail(
            org.pocEmail,
            'Your Organization Account Has Been Created - Login Credentials Inside',
            `Hello ${org.pointOfContact},\n\nYour organization account has been created successfully.\n\nUser ID: ${userId}\nPassword: ${password}\n\nPlease login using these credentials.\n\nRegards,\nBDC Team`,
            htmlContent
        );

        res.status(200).json({
            message: 'Credentials saved and email sent successfully.',
            emailSent: true,
            userCreated: true,
            organization: {
                name: org.officialName,
                email: org.pocEmail,
                contact: org.pointOfContact
            }
        });

    } catch (error) {
        console.error('Error in saveCredentials:', error);
        res.status(500).json({
            message: 'Error saving credentials or sending email',
            error: error.message,
            emailSent: false,
            userCreated: false
        });
    }
};

module.exports = {
    addOrganization,
    getAllOrganizations,
    updateOrganization,
    deleteOrganization,
    saveCredentials
};
