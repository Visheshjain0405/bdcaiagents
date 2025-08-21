const OrganizationUser = require('../models/organizationUser');

// Create a new organization user
const createOrganizationUser = async (req, res) => {
  try {
    const { fullName, email, contact, address, employeeId, designation, department, status, joinDate, organizationId } = req.body;

    // Check if all required fields are provided
    if (!fullName || !email || !contact || !address || !employeeId || !designation || !department || !status || !joinDate || !organizationId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create and save the organization user
    const organizationUser = new OrganizationUser({ fullName, email, contact, address, employeeId, designation, department, status, joinDate, organizationId });
    await organizationUser.save();
    res.status(201).json({ message: 'Organization User created successfully', organizationUser });
  } catch (error) {
    res.status(500).json({ message: 'Error creating organization user', error });
  }
};

// Get all organization users for an organization
const getAllOrganizationUsers = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const users = await OrganizationUser.find({ organizationId });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found for this organization' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization users', error });
  }
};

// Get an organization user by ID
const getOrganizationUserById = async (req, res) => {
  try {
    const user = await OrganizationUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Organization user not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization user', error });
  }
};

// Update organization user by ID
const updateOrganizationUserById = async (req, res) => {
  try {
    const { fullName, email, contact, address, employeeId, designation, department, status, joinDate } = req.body;

    const user = await OrganizationUser.findByIdAndUpdate(req.params.id, { fullName, email, contact, address, employeeId, designation, department, status, joinDate }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'Organization user not found' });
    }
    res.status(200).json({ message: 'Organization user updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating organization user', error });
  }
};

// Delete organization user by ID
const deleteOrganizationUserById = async (req, res) => {
  try {
    const user = await OrganizationUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Organization user not found' });
    }
    res.status(200).json({ message: 'Organization user deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting organization user', error });
  }
};

module.exports = { createOrganizationUser, getAllOrganizationUsers, getOrganizationUserById, updateOrganizationUserById, deleteOrganizationUserById };
