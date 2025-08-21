const Agent = require('../models/Agent');
const sanitizeHtml = require('sanitize-html');

// Sanitize HTML content
const sanitizeContent = (html) => {
  return sanitizeHtml(html, {
    allowedTags: ['b', 'i', 'u', 'p', 'div', 'a', 'img', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'code', 'pre', 'blockquote'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt']
    },
    allowedSchemes: ['http', 'https']
  });
};

// Get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new agent
exports.createAgent = async (req, res) => {
  try {
    const { description, howToUse, ...otherData } = req.body;

    // Sanitize HTML fields
    const sanitizedData = {
      ...otherData,
      description: sanitizeContent(description),
      howToUse: howToUse ? sanitizeContent(howToUse) : ''
    };

    const agent = new Agent(sanitizedData);
    const savedAgent = await agent.save();
    res.status(201).json({ agent: savedAgent });
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update an agent
exports.updateAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, howToUse, ...otherData } = req.body;

    // Sanitize HTML fields
    const sanitizedData = {
      ...otherData,
      description: sanitizeContent(description),
      howToUse: howToUse ? sanitizeContent(howToUse) : ''
    };

    const agent = await Agent.findByIdAndUpdate(id, sanitizedData, {
      new: true,
      runValidators: true
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findByIdAndDelete(id);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
};