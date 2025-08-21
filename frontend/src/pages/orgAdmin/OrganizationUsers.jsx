import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useAuth } from '../../context/AuthContext';
function OrganizationUsers() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // User model state
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    contact: '',
    address: '',
    employeeId: '',
    designation: '',
    department: '',
    status: '',
    joinDate: ''
  });

   const { user } = useAuth(); // Access the user data from AuthContext
   console.log(user)
  const organizationId = user?.organizationId;  // Extract organizationId from user data
  console.log(organizationId);

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset form data when modal closes
    setUserData({
      fullName: '',
      email: '',
      contact: '',
      address: '',
      employeeId: '',
      designation: '',
      department: '',
      status: '',
      joinDate: ''
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSaveUser = async() => {
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'contact', 'address', 'employeeId', 'designation', 'department', 'status', 'joinDate'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
// Check if the organizationId is present
    if (!organizationId) {
      alert('Organization ID is missing!');
      return;
    }

    const newUserData = {
      ...userData,
      organizationId
    };

      try {
      // Use Axios instance to send a POST request to the backend
      const response = await axiosInstance.post(`/users/organization/${organizationId}/users`, newUserData);

      if (response.status === 201) {
        alert('User saved successfully!');
        closeModal();
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    };

    // Log the user data (you can replace this with your API call)
    console.log('User Data:', userData);
    
    // Here you would typically send the data to your backend
    // Example: await saveUser(userData);
    
    alert('User saved successfully!');
    closeModal();
  };

  return (
    <>
      <style>
        {`
          .modal-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .modal-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #4f46e5, #6366f1);
            border-radius: 4px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #3730a3, #4338ca);
          }
          .glass-effect {
            backdrop-filter: blur(12px);
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .input-focus:focus {
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            border-color: #4f46e5;
          }
          .floating-label {
            transition: all 0.2s ease-in-out;
          }
          .gradient-border {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1px;
            border-radius: 12px;
          }
          .animate-slide-up {
            animation: slideUp 0.3s ease-out;
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Organization Users
                  </h1>
                  <p className="text-slate-600 mt-1">Manage your team members and user accounts</p>
                </div>
              </div>
              
              <button
                onClick={openModal}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add User</span>
                </div>
              </button>
            </div>
          </div>

          {/* Users Grid/List Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Active Users</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/50">
                  <option>All Departments</option>
                  <option>HR</option>
                  <option>IT</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>
            
            {/* Empty state */}
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-600 mb-2">No users found</h3>
              <p className="text-slate-400 mb-4">Get started by adding your first team member</p>
              <button
                onClick={openModal}
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Add your first user →
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 modal-scrollbar animate-slide-up">
              {/* Enhanced Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white p-8 rounded-t-3xl overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/30"></div>
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 glass-effect rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-wide">Add New User</h2>
                      <p className="text-indigo-100 mt-2 text-lg">Create a new user account for your organization</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={closeModal}
                    className="group w-12 h-12 glass-effect rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  >
                    <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Enhanced Form Content */}
              <div className="p-8 bg-gradient-to-br from-white to-slate-50">
                {/* Section Header */}
                <div className="flex items-center mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold mr-4 shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Personal Information</h3>
                    <p className="text-slate-600 mt-1">Fill in the details for the new team member</p>
                  </div>
                </div>
                
                {/* Enhanced Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                        placeholder="Enter full name"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                        placeholder="Enter email address"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="contact"
                        value={userData.contact}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                        placeholder="Enter phone number"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Address */}
                  <div className="md:col-span-2 lg:col-span-3 group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="address"
                        value={userData.address}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus resize-none"
                        rows="4"
                        placeholder="Enter complete address"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Employee ID */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Employee ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="employeeId"
                        value={userData.employeeId}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                        placeholder="Enter employee ID"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Designation */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="designation"
                        value={userData.designation}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                        placeholder="Enter designation"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Department */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="department"
                        value={userData.department}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus appearance-none cursor-pointer"
                      >
                        <option value="">Select department</option>
                        <option value="hr">Human Resources</option>
                        <option value="it">Information Technology</option>
                        <option value="finance">Finance</option>
                        <option value="marketing">Marketing</option>
                        <option value="sales">Sales</option>
                      </select>
                      <svg className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="status"
                        value={userData.status}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus appearance-none cursor-pointer"
                      >
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                      <svg className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Join Date */}
                  <div className="group">
                    <label className="block text-slate-700 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Join Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="joinDate"
                        value={userData.joinDate}
                        onChange={handleInputChange}
                        className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:border-slate-300 input-focus"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Footer */}
              <div className="border-t border-slate-200/50 p-6 bg-gradient-to-r from-slate-50 to-white rounded-b-3xl backdrop-blur-sm">
                <div className="flex justify-end space-x-4">
                  <button 
                    onClick={closeModal}
                    className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-medium transform hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveUser}
                    className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Save User</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrganizationUsers;