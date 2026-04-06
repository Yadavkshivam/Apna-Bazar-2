import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getExperts,
  getExpertById,
  getAvailableSlots,
  createBooking,
  getMyBookings,
  getExpertDashboard,
  getExpertBookings,
  acceptBooking,
  rejectBooking,
  registerAsExpert,
  updateAvailability,
  seedDemoExperts
} from '../controllers/expert.controller.js';

const expertRouter = Router();

// Public routes
expertRouter.get('/list', getExperts);
expertRouter.get('/details/:id', getExpertById);
expertRouter.get('/available-slots', getAvailableSlots);
expertRouter.post('/seed-demo', seedDemoExperts); // For development

// Protected routes (require auth)
expertRouter.post('/book', auth, createBooking);
expertRouter.get('/my-bookings', auth, getMyBookings);
expertRouter.get('/dashboard', auth, getExpertDashboard);
expertRouter.get('/bookings', auth, getExpertBookings);
expertRouter.put('/booking/:bookingId/accept', auth, acceptBooking);
expertRouter.put('/booking/:bookingId/reject', auth, rejectBooking);
expertRouter.post('/register', auth, registerAsExpert);
expertRouter.put('/availability', auth, updateAvailability);

export default expertRouter;