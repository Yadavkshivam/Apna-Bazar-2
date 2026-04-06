import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  createBooking,
  getUserBookings,
  getAllBookingsForExpert,
  approveBooking,
  rejectBooking,
  markCompleted,
  cancelBooking,
  getExpertStats
} from '../controllers/sessionBooking.controller.js';

const router = Router();

// ─── User Routes ─────────────────────────────────────────────────────────────
router.post('/create', auth, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.put('/cancel/:bookingId', auth, cancelBooking);

// ─── Expert Routes ────────────────────────────────────────────────────────────
router.get('/expert/all', auth, getAllBookingsForExpert);
router.get('/expert/stats', auth, getExpertStats);
router.put('/expert/approve/:bookingId', auth, approveBooking);   // ← added :bookingId
router.put('/expert/reject/:bookingId', auth, rejectBooking);     // ← added :bookingId
router.put('/expert/complete/:bookingId', auth, markCompleted);   // ← added :bookingId

export default router;