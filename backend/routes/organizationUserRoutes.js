const express = require('express');
const router = express.Router();
const { createOrganizationUser, getAllOrganizationUsers, getOrganizationUserById, updateOrganizationUserById, deleteOrganizationUserById } = require('../controllers/organizationUserController');

// Route to create a new organization user
router.post('/organization/:organizationId/users', createOrganizationUser);

// Route to get all organization users for a specific organization
router.get('/organization/:organizationId/users', getAllOrganizationUsers);

// Route to get an organization user by ID
router.get('/users/:id', getOrganizationUserById);

// Route to update an organization user by ID
router.put('/users/:id', updateOrganizationUserById);

// Route to delete an organization user by ID
router.delete('/users/:id', deleteOrganizationUserById);

module.exports = router;
