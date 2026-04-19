const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/chat').post(protect, processChat);

module.exports = router;
