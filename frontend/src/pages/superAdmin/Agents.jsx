import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Editor } from '@tinymce/tinymce-react';

// Function to truncate HTML to 2-3 lines (approx 150 characters)
const truncateDescription = (html, maxLength = 150) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  if (text.length <= maxLength) return html;
  const truncatedText = text.slice(0, maxLength).trim() + '...';
  div.textContent = truncatedText;
  return div.innerHTML;
};

const Agents = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agents, setAgents] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const [formData, setFormData] = useState({
    agentName: '',
    agentCategory: '',
    description: '',
    liveLink: '',
    subscriptionType: '',
    howToUse: '',
    pricing: '',
    pricingCurrency: 'INR',
    apiDocumentation: '',
    isActive: true
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await axiosInstance.get('/agents/');
      setAgents(res.data);
      console.log('Fetched agents:', res.data);
      res.data.forEach((agent) => {
        console.log(`Agent ${agent.agentName} - howToUse:`, agent.howToUse);
      });
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditorChange = (name, content) => {
    setFormData({
      ...formData,
      [name]: content
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        const res = await axiosInstance.put(`/agents/${editingAgent._id}`, formData);
        setAgents((prev) =>
          prev.map((agent) => (agent._id === editingAgent._id ? res.data : agent))
        );
        console.log('Updated:', res.data);
      } else {
        const res = await axiosInstance.post('/agents/add', formData);
        setAgents((prev) => [...prev, res.data.agent]);
        console.log('Added:', res.data);
      }
      setShowModal(false);
      resetForm();
      setEditingAgent(null);
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      agentName: '',
      agentCategory: '',
      description: '',
      liveLink: '',
      subscriptionType: '',
      howToUse: '',
      pricing: '',
      pricingCurrency: 'INR',
      apiDocumentation: '',
      isActive: true
    });
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      ...agent,
      pricingCurrency: agent.pricingCurrency || 'INR'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axiosInstance.delete(`/agents/${id}`);
        setAgents((prev) => prev.filter((agent) => agent._id !== id));
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingAgent(null);
    resetForm();
    setShowModal(true);
  };

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('description');
    setShowDetailsModal(true);
    console.log('Selected agent for details:', agent);
  };

  const CustomSelect = ({ name, value, options, placeholder, onChange, required = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white flex justify-between items-center ${
            !value ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          <span>{value || placeholder}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(name, option.value);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const agentCategories = [
    { value: 'calling-agent', label: 'Calling Agent' },
    { value: 'messaging-agent', label: 'Messaging Agent' },
    { value: 'chatbot-agent', label: 'Chatbot Agent' },
    { value: 'whatsapp-agent', label: 'WhatsApp Agent' },
    { value: 'voice-agent', label: 'Voice Agent' },
    { value: 'email-agent', label: 'Email Agent' },
    { value: 'support-agent', label: 'Support Agent' },
    { value: 'analytics-agent', label: 'Analytics Agent' },
    { value: 'automation-agent', label: 'Automation Agent' },
    { value: 'other', label: 'Other' }
  ];

  const subscriptionTypes = [
    { value: 'messages', label: 'Messages Based' },
    { value: 'minutes', label: 'Minutes Based' },
    { value: 'characters', label: 'Characters Based' },
    { value: 'monthly', label: 'Monthly Subscription' },
    { value: 'yearly', label: 'Yearly Subscription' },
    { value: 'pay-per-use', label: 'Pay Per Use' },
    { value: 'free', label: 'Free' }
  ];

  const currencyOptions = [
    { value: 'INR', label: 'INR (₹)' },
    { value: 'USD', label: 'USD ($)' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Agents
            </h1>
            <p className="text-gray-600 mt-2">Manage your AI agent tools and configurations</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Agent
          </button>
        </div>

        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100 overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2 truncate">{agent.agentName}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                          {agentCategories.find((cat) => cat.value === agent.agentCategory)?.label ||
                            agent.agentCategory}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                          {subscriptionTypes.find((sub) => sub.value === agent.subscriptionType)?.label ||
                            agent.subscriptionType}
                        </span>
                        {agent.isActive && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Active"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-200"
                        title="Edit Agent"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors duration-200"
                        title="Delete Agent"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Overview</h4>
                    <div
                      className="text-sm text-gray-600 line-clamp-3"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                      dangerouslySetInnerHTML={{
                        __html: truncateDescription(agent.description || '<p>No description available</p>')
                      }}
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Details</h4>
                    {agent.liveLink && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-blue-600 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <a
                            href={agent.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate font-medium"
                          >
                            Try Live Demo
                          </a>
                        </div>
                      </div>
                    )}
                    {agent.pricing && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="text-xs font-medium text-green-800 mb-1">Pricing</h4>
                        <p className="text-sm font-semibold text-green-900">
                          {agent.pricingCurrency === 'INR' ? '₹' : '$'}
                          {agent.pricing}
                        </p>
                      </div>
                    )}
                    {agent.apiDocumentation && (
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <h4 className="text-xs font-medium text-purple-800 mb-1">API Documentation</h4>
                        <a
                          href={agent.apiDocumentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-purple-600 hover:text-purple-800 truncate font-medium"
                        >
                          View Documentation
                        </a>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleViewDetails(agent)}
                    className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-4v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2zm-4.5 4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                      />
                    </svg>
                    View Details
                  </button>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-gray-600">{agent.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="text-xs text-gray-400">ID: {agent._id?.slice(-8) || 'N/A'}</div>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No AI agents configured yet</h3>
              <p className="text-gray-600">Start by adding your first AI agent to get started</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{editingAgent ? 'Edit AI Agent' : 'Add New AI Agent'}</h2>
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
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Agent Name *</label>
                        <input
                          type="text"
                          name="agentName"
                          value={formData.agentName}
                          onChange={handleChange}
                          placeholder="Enter agent name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Agent Category *</label>
                        <CustomSelect
                          name="agentCategory"
                          value={agentCategories.find((cat) => cat.value === formData.agentCategory)?.label || ''}
                          options={agentCategories}
                          placeholder="Select agent category"
                          onChange={handleSelectChange}
                          required
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Description *</label>
                        <Editor
                          apiKey="hcgq64n79gny40xpkl47geb0j0txq8qn1fcnyetf98rg90so"
                          value={formData.description}
                          onEditorChange={(content) => handleEditorChange('description', content)}
                          init={{
                            height: 200,
                            menubar: true,
                            plugins: [
                              'advlist',
                              'autolink',
                              'lists',
                              'link',
                              'image',
                              'charmap',
                              'preview',
                              'anchor',
                              'searchreplace',
                              'visualblocks',
                              'code',
                              'fullscreen',
                              'insertdatetime',
                              'media',
                              'table',
                              'code',
                              'help',
                              'wordcount',
                              'emoticons',
                              'codesample',
                              'quickbars',
                              'accordion'
                            ],
                            toolbar:
                              'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table | forecolor backcolor | emoticons | code | preview fullscreen | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Live Link</label>
                        <input
                          type="url"
                          name="liveLink"
                          value={formData.liveLink}
                          onChange={handleChange}
                          placeholder="https://your-agent-demo.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Subscription Type *</label>
                        <CustomSelect
                          name="subscriptionType"
                          value={subscriptionTypes.find((sub) => sub.value === formData.subscriptionType)?.label || ''}
                          options={subscriptionTypes}
                          placeholder="Select subscription type"
                          onChange={handleSelectChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Detailed Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">How to Use</label>
                        <Editor
                          apiKey="hcgq64n79gny40xpkl47geb0j0txq8qn1fcnyetf98rg90so"
                          value={formData.howToUse}
                          onEditorChange={(content) => handleEditorChange('howToUse', content)}
                          init={{
                            height: 200,
                            menubar: true,
                            plugins: [
                              'advlist',
                              'autolink',
                              'lists',
                              'link',
                              'image',
                              'charmap',
                              'preview',
                              'anchor',
                              'searchreplace',
                              'visualblocks',
                              'code',
                              'fullscreen',
                              'insertdatetime',
                              'media',
                              'table',
                              'code',
                              'help',
                              'wordcount',
                              'emoticons',
                              'codesample',
                              'quickbars',
                              'accordion'
                            ],
                            toolbar:
                              'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | table | forecolor backcolor | emoticons | code | preview fullscreen | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Pricing Information</label>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            name="pricing"
                            value={formData.pricing}
                            onChange={handleChange}
                            placeholder="e.g., 0.01 per message, 10/month"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          />
                          <div className="w-32">
                            <CustomSelect
                              name="pricingCurrency"
                              value={currencyOptions.find((c) => c.value === formData.pricingCurrency)?.label || 'INR (₹)'}
                              options={currencyOptions}
                              placeholder="Select currency"
                              onChange={handleSelectChange}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">API Documentation</label>
                        <input
                          type="url"
                          name="apiDocumentation"
                          value={formData.apiDocumentation}
                          onChange={handleChange}
                          placeholder="https://docs.your-agent.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">Agent is active and available for use</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors duration-200 order-2 sm:order-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 order-1 sm:order-2"
                    >
                      {editingAgent ? 'Update Agent' : 'Add Agent'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{selectedAgent.agentName}</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAgent(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'description'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  onClick={() => {
                    setActiveTab('description');
                    console.log('Switched to Description tab');
                  }}
                >
                  Description
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'howToUse'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  onClick={() => {
                    setActiveTab('howToUse');
                    console.log('Switched to How to Use tab, content:', selectedAgent.howToUse);
                  }}
                >
                  How to Use
                </button>
              </div>
              <div
                className="text-sm text-gray-600 prose max-w-none"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                dangerouslySetInnerHTML={{
                  __html:
                    activeTab === 'description'
                      ? selectedAgent.description || '<p style="color: #666;">No description available</p>'
                      : selectedAgent.howToUse || '<p style="color: #666;">No how-to-use information available</p>'
                }}
              />
              <style>
                {`
                  .prose h1 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #1f2937;
                    margin: 1rem 0 0.5rem;
                  }
                  .prose h2 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    color: #374151;
                    margin: 1rem 0 0.5rem;
                  }
                  .prose p {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                  }
                  .prose ul, .prose ol {
                    margin: 0.5rem 0 0.5rem 1.5rem;
                    padding-left: 1rem;
                  }
                  .prose li {
                    margin: 0.25rem 0;
                  }
                  .prose a {
                    color: #4b5ee0;
                    text-decoration: underline;
                  }
                  .prose strong {
                    font-weight: bold;
                  }
                  .prose em {
                    font-style: italic;
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;