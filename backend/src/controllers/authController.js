const User = require('../models/User');
const Captain = require('../models/Captain');
const Admin = require('../models/Admin');
const Service = require('../models/Service');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register/user
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  if (user) {
    generateToken(res, user._id, user.role);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Register a new captain
// @route   POST /api/auth/register/captain
// @access  Public
const registerCaptain = async (req, res) => {
  const { name, email, password, phone, serviceType, customService, isCustomService } = req.body;

  const captainExists = await Captain.findOne({ email });

  if (captainExists) {
    return res.status(400).json({ message: 'Captain already exists' });
  }

  try {
    let finalServiceType = serviceType;

    // If it's a custom service, create it in the database using the entered custom service name
    if (isCustomService && customService) {
      const trimmedServiceType = customService.trim();

      if (trimmedServiceType.length < 2) {
        return res.status(400).json({ message: 'Service name must be at least 2 characters' });
      }

      // Check if service already exists (case-insensitive)
      const serviceExists = await Service.findOne({ name: { $regex: `^${trimmedServiceType}$`, $options: 'i' } });
      if (!serviceExists) {
        // Create the new service
        await Service.create({
          name: trimmedServiceType,
          description: `${trimmedServiceType} service`,
          basePrice: 500 // Default base price in INR
        });
        finalServiceType = trimmedServiceType;
      } else {
        finalServiceType = serviceExists.name; // Use the stored service name casing
      }
    }

    const captain = await Captain.create({
      name,
      email,
      password,
      phone,
      serviceType: finalServiceType
    });

    if (captain) {
      generateToken(res, captain._id, 'captain');
      res.status(201).json({
        _id: captain._id,
        name: captain.name,
        email: captain.email,
        phone: captain.phone,
        role: 'captain',
        serviceType: captain.serviceType,
        isApproved: captain.isApproved,
        earnings: captain.earnings || 0
      });
    } else {
      res.status(400).json({ message: 'Invalid captain data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Registration failed' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password, role } = req.body;

  let account;
  if (role === 'captain') {
    account = await Captain.findOne({ email }).select('+password');
  }
  else if (role === 'admin') {
    account = await User.findOne({ email }).select('+password');
  }
  else {
    account = await User.findOne({ email }).select('+password');
  }

  if (account && (await account.matchPassword(password))) {
    // If it's a captain check approval (optional, depends on policy)
    // if (role === 'captain' && !account.isApproved) {
    //   return res.status(403).json({ message: 'Account pending admin approval' });
    // }

    generateToken(res, account._id, role || account.role);
    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      role: role || account.role,
      ...(account.role === 'captain' && { earnings: account.earnings || 0 })
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    path: '/',
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  const account = req.user;

  if (account) {
    res.json({
      _id: account._id,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      ...(account.role === 'captain' && {
        serviceType: account.serviceType,
        isApproved: account.isApproved,
        isAvailable: account.isAvailable,
        earnings: account.earnings || 0,
        rating: account.rating || 0
      })
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user/captain profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const account = req.user;

  if (account) {
    account.name = req.body.name || account.name;
    account.phone = req.body.phone || account.phone;

    if (req.body.password) {
      account.password = req.body.password;
    }

    const updatedAccount = await account.save();

    res.json({
      _id: updatedAccount._id,
      name: updatedAccount.name,
      email: updatedAccount.email,
      phone: updatedAccount.phone,
      role: updatedAccount.role,
      ...(updatedAccount.role === 'captain' && {
        serviceType: updatedAccount.serviceType,
        isApproved: updatedAccount.isApproved,
        isAvailable: updatedAccount.isAvailable,
        earnings: updatedAccount.earnings || 0,
        rating: updatedAccount.rating || 0
      })
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Withdraw captain earnings
// @route   POST /api/auth/withdraw
// @access  Private (Captain)
const withdrawEarnings = async (req, res) => {
  try {
    const captain = await Captain.findById(req.user._id);

    if (!captain) {
      return res.status(404).json({ message: 'Captain not found' });
    }

    if (!captain.earnings || captain.earnings <= 0) {
      return res.status(400).json({ message: 'No earnings to withdraw' });
    }

    // Simulate bank transfer delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const amountWithdrawn = captain.earnings;
    captain.earnings = 0; // Reset earnings after successful bank transfer
    await captain.save();

    res.json({ message: 'Transfer to bank successful', amount: amountWithdrawn });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  registerCaptain,
  login,
  logout,
  getProfile,
  updateProfile,
  withdrawEarnings
};
