const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a service (Admin only)
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, description, basePrice, imageUrl } = req.body;

    // Validation
    if (!name || !description || !basePrice) {
      return res.status(400).json({ message: 'Name, description, and basePrice are required' });
    }

    // Check for duplicate service
    const serviceExists = await Service.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (serviceExists) {
      return res.status(400).json({ message: 'Service with this name already exists' });
    }

    const service = new Service({
      name,
      description,
      basePrice,
      imageUrl
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Invalid service data' });
  }
};

// @desc    Create a service (Public - for captain registration with custom service)
// @route   POST /api/services/public
// @access  Public
const createPublicService = async (req, res) => {
  try {
    const { name, description, basePrice } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ message: 'Service name is required' });
    }

    // Trim and validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      return res.status(400).json({ message: 'Service name must be at least 2 characters' });
    }

    // Check for duplicate service (case-insensitive)
    const serviceExists = await Service.findOne({ name: { $regex: `^${trimmedName}$`, $options: 'i' } });
    if (serviceExists) {
      return res.status(200).json(serviceExists); // Return existing service
    }

    const service = new Service({
      name: trimmedName,
      description: description || `${trimmedName} service`,
      basePrice: basePrice || 500 // Default to ₹500 if not provided
    });

    const createdService = await service.save();
    res.status(201).json(createdService);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create service' });
  }
};

module.exports = {
  getServices,
  createService,
  createPublicService
};
