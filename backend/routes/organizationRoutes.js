// backend/routes/organizationRoutes.js
const express = require('express');
const router = express.Router();
const { addOrganization, getAllOrganizations, updateOrganization, deleteOrganization, saveCredentials } = require('../controllers/organizationController');

router.post('/add', addOrganization);
router.get('/', getAllOrganizations);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);
router.post('/:id/save-credentials', saveCredentials);


module.exports = router;
