import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
const Organization = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [selectedOrgForCredentials, setSelectedOrgForCredentials] = useState(null);
  const [credentialsData, setCredentialsData] = useState({ userId: '', password: '' });
  const [isEditingCredentials, setIsEditingCredentials] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const [formData, setFormData] = useState({
    officialName: '',
    address: '',
    city: '',
    state: '',
    organizationType: '',
    registeredCountry: '',
    pointOfContact: '',
    pocEmail: '',
    pocMobile: '',
    pocCountryCode: '+91',
    whatsappNumber: '',
    whatsappCountryCode: '+91',
    planType: '',
    businessArea: '',
    listOfServices: '',
    gstin: '',
    pan: '',
    website: ''
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await axiosInstance.get('/organization/');
      setOrganizations(res.data);
      console.log(res.data)
    } catch (error) {
      console.error('Failed to load organizations:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        const res = await axiosInstance.put(`/organization/${editingOrg._id}`, formData);
        setOrganizations((prev) =>
          prev.map((org) => (org._id === editingOrg._id ? res.data : org))
        );
        console.log('Updated:', res.data);
      } else {
        const res = await axiosInstance.post('/organization/add', formData);
        setOrganizations((prev) => [...prev, res.data.organization]);
        console.log('Added:', res.data);
      }
      setShowModal(false);
      resetForm();
      setEditingOrg(null);
    } catch (error) {
      console.error('Error saving organization:', error);
    }
  };


  const resetForm = () => {
    setFormData({
      officialName: '',
      address: '',
      city: '',
      state: '',
      organizationType: '',
      registeredCountry: '',
      pointOfContact: '',
      pocEmail: '',
      pocMobile: '',
      pocCountryCode: '+91',
      whatsappNumber: '',
      whatsappCountryCode: '+91',
      planType: '',
      businessArea: '',
      listOfServices: '',
      gstin: '',
      pan: '',
      website: ''
    });
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
    setFormData(org);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await axiosInstance.delete(`/organization/${id}`);
        setOrganizations((prev) => prev.filter((org) => org._id !== id));
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };


  const handleAddNew = () => {
    setEditingOrg(null);
    resetForm();
    setShowModal(true);
  };

  // Credentials Management Functions
  const generateCredentials = () => {
    const userId = `ORG_${Date.now()}`;
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    return { userId, password };
  };

  const handleCredentialsSettings = (org) => {
    setSelectedOrgForCredentials(org);
    if (org.credentials) {
      // If credentials exist, show them
      setCredentialsData(org.credentials);
      setIsEditingCredentials(false);
    } else {
      // If no credentials, start with empty form
      setCredentialsData({ userId: '', password: '' });
      setIsEditingCredentials(false);
    }
    setShowCredentialsModal(true);
  };

  const handleGenerateNewCredentials = () => {
    const newCredentials = generateCredentials();
    setCredentialsData(newCredentials);
    setIsEditingCredentials(true);
  };

  const handleEditCredentials = () => {
    setIsEditingCredentials(true);
  };

  const handleSaveCredentials = async () => {
    if (!selectedOrgForCredentials || !credentialsData.userId || !credentialsData.password) return;

    try {
      // 1. Call the backend API to save credentials
      const response = await axiosInstance.post(
        `/organization/${selectedOrgForCredentials._id}/save-credentials`,
        credentialsData
      );

      console.log('Saved and emailed:', response.data);

      // 2. Update local state (optional, shows green dot on card)
      setOrganizations(orgs =>
        orgs.map(org =>
          org._id === selectedOrgForCredentials._id
            ? {
              ...org,
              credentials: {
                userId: credentialsData.userId,
                password: credentialsData.password,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
            : org
        )
      );

      // 3. Reset and close
      setIsEditingCredentials(false);
      setShowCredentialsModal(false);
      setCredentialsData({ userId: '', password: '' });
      setSelectedOrgForCredentials(null);

      // 4. Optional: Toast or alert
      alert('ID and password saved and email sent to the organization.');

    } catch (error) {
      console.error('Failed to save credentials:', error);
      alert('Something went wrong while saving credentials.');
    }
  };

  const handleDeleteCredentials = () => {
    if (window.confirm('Are you sure you want to delete the credentials for this organization? This action cannot be undone.')) {
      setOrganizations(orgs =>
        orgs.map(o =>
          o.id === selectedOrgForCredentials.id ? { ...o, credentials: null } : o
        )
      );
      setShowCredentialsModal(false);
      setCredentialsData({ userId: '', password: '' });
      setSelectedOrgForCredentials(null);
      setIsEditingCredentials(false);
    }
  };

  const handleCredentialsChange = (e) => {
    const { name, value } = e.target;
    setCredentialsData(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const closeCredentialsModal = () => {
    setShowCredentialsModal(false);
    setCredentialsData({ userId: '', password: '' });
    setSelectedOrgForCredentials(null);
    setIsEditingCredentials(false);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);


  const organizationTypes = ['Private Limited', 'Public Limited', 'LLP', 'Partnership', 'Sole Proprietorship', 'NGO', 'Trust'];
  const planTypes = ['Basic', 'Standard', 'Premium', 'Enterprise'];
  const businessAreas = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Services', 'Other'];
  const states = ['Gujarat', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Other'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Organizations
            </h1>
            <p className="text-gray-600 mt-2">Manage your organization details and settings</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Organization
          </button>
        </div>

        {/* Organizations Grid */}
        {organizations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div key={org._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 overflow-hidden group">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">{org.officialName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                          {org.organizationType}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                          {org.planType}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {/* Settings Icon for Credentials */}
                      <button
                        onClick={() => handleCredentialsSettings(org)}
                        className="p-2 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg transition-colors duration-200 group"
                        title="Credentials Settings"
                      >
                        <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>

                      {/* Credentials Status Indicator */}
                      {org.credentials && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Credentials Active"></div>
                        </div>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(org)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200 group"
                        title="Edit Organization"
                      >
                        <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(org._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200 group"
                        title="Delete Organization"
                      >
                        <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Contact Information */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{org.pointOfContact}</p>
                        <p className="text-xs text-gray-500">Point of Contact</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{org.pocEmail}</p>
                        <p className="text-xs text-gray-500">Email Address</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{org.pocCountryCode} {org.pocMobile}</p>
                        <p className="text-xs text-gray-500">Mobile Number</p>
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{org.address}</p>
                        <p className="text-xs text-gray-500">{org.city}, {org.state}, {org.registeredCountry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{org.businessArea}</p>
                        <p className="text-xs text-gray-500">Business Area</p>
                      </div>
                    </div>

                    {org.listOfServices && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Services</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{org.listOfServices}</p>
                      </div>
                    )}

                    {/* Additional Info */}
                    {(org.gstin || org.pan || org.website) && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {org.gstin && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">GSTIN:</span>
                              <span className="font-medium text-gray-900">{org.gstin}</span>
                            </div>
                          )}
                          {org.pan && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">PAN:</span>
                              <span className="font-medium text-gray-900">{org.pan}</span>
                            </div>
                          )}
                          {org.website && (
                            <div className="flex justify-between">
                              <span className="text-gray-500">Website:</span>
                              <a href={org.website} target="_blank" rel="noopener noreferrer" className="font-medium text-indigo-600 hover:text-indigo-800 truncate max-w-32">
                                {org.website.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {org.whatsappNumber && (
                        <a
                          href={`https://wa.me/${org.whatsappCountryCode.replace('+', '')}${org.whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          WhatsApp
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {org._id.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No organizations listed yet</h3>
              <p className="text-gray-600">Start by adding your first organization to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{editingOrg ? 'Edit Organization' : 'Add New Organization'}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information Section */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Official Name *</label>
                    <input
                      type="text"
                      name="officialName"
                      value={formData.officialName}
                      onChange={handleChange}
                      placeholder="Enter official organization name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Organization Type *</label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select organization type</option>
                      {organizationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Registered Country *</label>
                    <input
                      type="text"
                      name="registeredCountry"
                      value={formData.registeredCountry}
                      onChange={handleChange}
                      placeholder="e.g., India"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Contact Information Section */}
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Contact Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Point of Contact *</label>
                    <input
                      type="text"
                      name="pointOfContact"
                      value={formData.pointOfContact}
                      onChange={handleChange}
                      placeholder="Contact person name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">POC Email *</label>
                    <input
                      type="email"
                      name="pocEmail"
                      value={formData.pocEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">POC Mobile *</label>
                    <div className="flex gap-2">
                      <select
                        name="pocCountryCode"
                        value={formData.pocCountryCode}
                        onChange={handleChange}
                        className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="tel"
                        name="pocMobile"
                        value={formData.pocMobile}
                        onChange={handleChange}
                        placeholder="Mobile number"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                    <div className="flex gap-2">
                      <select
                        name="whatsappCountryCode"
                        value={formData.whatsappCountryCode}
                        onChange={handleChange}
                        className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="+91">+91</option>
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                      </select>
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        placeholder="WhatsApp number"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Business Information Section */}
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
                      </svg>
                      Business Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Plan Type *</label>
                    <select
                      name="planType"
                      value={formData.planType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select plan type</option>
                      {planTypes.map(plan => (
                        <option key={plan} value={plan}>{plan}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Business Area *</label>
                    <select
                      name="businessArea"
                      value={formData.businessArea}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Select business area</option>
                      {businessAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">List of Services *</label>
                    <textarea
                      name="listOfServices"
                      value={formData.listOfServices}
                      onChange={handleChange}
                      placeholder="Describe the services offered by your organization"
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Legal Information Section */}
                  <div className="lg:col-span-2 mt-8">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Legal Information
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">GSTIN</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="GST Identification Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">PAN</label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="Permanent Account Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {editingOrg ? 'Update Organization' : 'Add Organization'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Settings Modal */}
      {showCredentialsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Credentials Settings
                </h2>
                <button
                  onClick={closeCredentialsModal}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {selectedOrgForCredentials && (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
                    <h3 className="font-semibold text-indigo-800 mb-1">{selectedOrgForCredentials.officialName}</h3>
                    <p className="text-sm text-indigo-600">{selectedOrgForCredentials.organizationType}</p>
                  </div>
                </div>
              )}

              {/* No Credentials State */}
              {!selectedOrgForCredentials?.credentials && !isEditingCredentials && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Credentials Set</h3>
                  <p className="text-gray-600 mb-6">Create ID and password for this organization</p>
                  <button
                    onClick={handleGenerateNewCredentials}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Generate ID & Password
                  </button>
                </div>
              )}

              {/* Credentials Form */}
              {(selectedOrgForCredentials?.credentials || isEditingCredentials) && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="userId"
                        value={credentialsData.userId}
                        onChange={handleCredentialsChange}
                        placeholder="Enter user ID"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        readOnly={!isEditingCredentials}
                      />
                      {credentialsData.userId && (
                        <button
                          onClick={() => copyToClipboard(credentialsData.userId)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy User ID"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="password"
                        value={credentialsData.password}
                        onChange={handleCredentialsChange}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        readOnly={!isEditingCredentials}
                      />
                      {credentialsData.password && (
                        <button
                          onClick={() => copyToClipboard(credentialsData.password)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Copy Password"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Information */}
                  {selectedOrgForCredentials?.credentials && !isEditingCredentials && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-green-800">Credentials Active</span>
                      </div>
                      <div className="text-xs text-green-600 space-y-1">
                        <p>Created: {new Date(selectedOrgForCredentials.credentials.createdAt).toLocaleString()}</p>
                        {selectedOrgForCredentials.credentials.updatedAt && (
                          <p>Updated: {new Date(selectedOrgForCredentials.credentials.updatedAt).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Edit Mode Info */}
                  {isEditingCredentials && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Editing Credentials</p>
                          <p className="text-xs text-blue-600">
                            Make sure to save your changes. These credentials will be used for organization access.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={closeCredentialsModal}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200"
                >
                  Close
                </button>

                {/* Show different buttons based on state */}
                {selectedOrgForCredentials?.credentials && !isEditingCredentials && (
                  <>
                    <button
                      onClick={handleEditCredentials}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteCredentials}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </>
                )}

                {isEditingCredentials && (
                  <>
                    <button
                      onClick={() => setIsEditingCredentials(false)}
                      className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveCredentials}
                      disabled={!credentialsData.userId || !credentialsData.password}
                      className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;