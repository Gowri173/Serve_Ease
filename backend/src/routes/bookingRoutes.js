const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getCaptainBookings,
  updateBookingStatus,
  processMockPayment,
  submitRating,
  getBookingTracking,
  updateCaptainLocation
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, authorize('user'), createBooking);

router.route('/mybookings')
  .get(protect, authorize('user'), getMyBookings);

router.route('/captain')
  .get(protect, authorize('captain'), getCaptainBookings);

router.route('/:id/status')
  .put(protect, authorize('captain'), updateBookingStatus);

router.route('/:id/pay')
  .post(protect, authorize('user'), processMockPayment);

router.route('/:id/rate')
  .post(protect, authorize('user'), submitRating);

router.route('/:id/tracking')
  .get(protect, getBookingTracking);

router.route('/:id/location')
  .put(protect, authorize('captain'), updateCaptainLocation);

module.exports = router;
