const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  agentName: {
    type: String,
    required: [true, 'Agent name is required'],
    trim: true,
    maxlength: [100, 'Agent name cannot exceed 100 characters']
  },
  agentCategory: {
    type: String,
    required: [true, 'Agent category is required'],
    enum: [
      'calling-agent',
      'messaging-agent',
      'chatbot-agent',
      'whatsapp-agent',
      'voice-agent',
      'email-agent',
      'support-agent',
      'analytics-agent',
      'automation-agent',
      'other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  liveLink: {
    type: String,
    trim: true,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please provide a valid URL']
  },
  subscriptionType: {
    type: String,
    required: [true, 'Subscription type is required'],
    enum: [
      'messages',
      'minutes',
      'characters',
      'monthly',
      'yearly',
      'pay-per-use',
      'free'
    ]
  },
  howToUse: {
    type: String,
    default: ''
  },
  pricing: {
    type: String,
    trim: true
  },
  pricingCurrency: {
    type: String,
    enum: ['INR', 'USD'],
    default: 'INR'
  },
  apiDocumentation: {
    type: String,
    trim: true,
    match: [/^https?:\/\/[^\s$.?#].[^\s]*$/, 'Please provide a valid URL']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);