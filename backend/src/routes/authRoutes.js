const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerCaptain,
  login,
  logout,
  getProfile,
  withdrawEarnings
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/register/user', registerUser);
router.post('/register/captain', registerCaptain);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.post('/withdraw', protect, authorize('captain'), withdrawEarnings);

module.exports = router;
