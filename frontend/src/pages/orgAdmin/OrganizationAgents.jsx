import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';

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

function OrganizationAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axiosInstance.get('/agents/');
        setAgents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch agents');
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('description');
    setShowDetailsModal(true);
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Agents</h2>
              <p className="text-gray-600">Please wait while we fetch your agents...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Agents</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Available Agents
            </h1>
            <p className="text-gray-600 text-lg">Discover and use AI agents for your organization</p>
            {agents.length > 0 && (
              <div className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                {agents.filter(agent => agent.isActive).length} of {agents.length} agents available
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        {agents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Agents Available</h3>
              <p className="text-gray-600">There are currently no AI agents configured for your organization.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col h-full"
              >
                {/* Header with indigo to purple gradient background */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white truncate flex-1 pr-2 min-h-[28px]">
                      {agent.agentName || 'Unnamed Agent'}
                    </h3>
                  </div>

                  {/* Category and Subscription Type Pills */}
                  <div className="flex gap-2 flex-wrap min-h-[32px] items-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                      {agentCategories.find((cat) => cat.value === agent.agentCategory)?.label || agent.agentCategory || 'Other'}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20 text-white border border-white border-opacity-30">
                      {subscriptionTypes.find((sub) => sub.value === agent.subscriptionType)?.label || agent.subscriptionType || 'N/A'}
                    </span>
                    {/* Active Status Indicator */}
                    {agent.isActive && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* White content area - flexible grow */}
                <div className="bg-white px-6 py-4 space-y-4 flex-grow flex flex-col">
                  {/* Overview Section */}
                  <div className="flex-grow">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Overview</h4>
                    <div
                      className="text-sm text-gray-600 leading-relaxed min-h-[60px]"
                      dangerouslySetInnerHTML={{
                        __html: truncateDescription(agent.description || '<p>No description available</p>')
                      }}
                    />
                  </div>

                  {/* Details Section */}
                  <div className="mt-auto">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Details</h4>
                    <div className="space-y-3 min-h-[120px]">
                      {/* Live Link */}
                      {agent.liveLink && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <a
                              href={agent.liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Try Live Demo
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Pricing */}
                      {agent.pricing && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <h5 className="text-xs font-semibold text-green-800 mb-1">Pricing</h5>
                          <p className="text-lg font-bold text-green-900">
                            {agent.pricingCurrency === 'INR' ? '₹' : '$'}
                            {agent.pricing}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(agent)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-all duration-200 mt-6"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-4v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2zm-4.5 4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                      </svg>
                      View Details
                    </button>
                  </div>
                </div>

                {/* Footer Status - always at bottom */}
                <div className="bg-white px-6 py-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-600">
                        {agent.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      ID: {agent._id?.slice(-8) || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">{selectedAgent.agentName}</h2>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedAgent(null);
                  }}
                  className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  } rounded-t-lg`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'howToUse'
                      ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  } rounded-t-lg`}
                  onClick={() => setActiveTab('howToUse')}
                >
                  How to Use
                </button>
              </div>

              {/* Tab Content */}
              <div className="prose prose-sm max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px' }}
                  dangerouslySetInnerHTML={{
                    __html:
                      activeTab === 'description'
                        ? selectedAgent.description || '<p style="color: #666;">No description available</p>'
                        : selectedAgent.howToUse || '<p style="color: #666;">No how-to-use information available</p>'
                  }}
                />
              </div>

              {/* Agent Details Summary */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Category:</span>
                    <p className="text-sm text-gray-800 mt-1">
                      {agentCategories.find((cat) => cat.value === selectedAgent.agentCategory)?.label || selectedAgent.agentCategory}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Subscription Type:</span>
                    <p className="text-sm text-gray-800 mt-1">
                      {subscriptionTypes.find((sub) => sub.value === selectedAgent.subscriptionType)?.label || selectedAgent.subscriptionType}
                    </p>
                  </div>
                  {selectedAgent.pricing && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Pricing:</span>
                      <p className="text-sm text-gray-800 mt-1 font-semibold">
                        {selectedAgent.pricingCurrency === 'INR' ? '₹' : '$'}{selectedAgent.pricing}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${selectedAgent.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-800">{selectedAgent.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Links */}
                {(selectedAgent.liveLink || selectedAgent.apiDocumentation) && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      {selectedAgent.liveLink && (
                        <a
                          href={selectedAgent.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Try Live Demo
                        </a>
                      )}
                      {selectedAgent.apiDocumentation && (
                        <a
                          href={selectedAgent.apiDocumentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          API Documentation
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

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
                  .prose h3 {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #4b5563;
                    margin: 0.75rem 0 0.5rem;
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
                    color: #4f46e5;
                    text-decoration: underline;
                  }
                  .prose strong {
                    font-weight: bold;
                  }
                  .prose em {
                    font-style: italic;
                  }
                  .prose blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    color: #6b7280;
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationAgents;
