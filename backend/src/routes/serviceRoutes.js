const express = require('express');
const router = express.Router();
const {
  getServices,
  createService,
  createPublicService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin'), createService);

// Public endpoint for creating services (used during captain registration with custom service)
router.post('/public/create', createPublicService);

module.exports = router;
