import SessionBooking from '../models/sessionBooking.model.js';
import UserModel from '../models/user.model.js';

// ─── Create Booking ───────────────────────────────────────────────────────────
export const createBooking = async (request, response) => {
  try {
    const userId = request.userId;

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized. Please login.', error: true, success: false });
    }

    const user = await UserModel.findById(userId).select('-password -refresh_token');
    if (!user) {
      return response.status(404).json({ message: 'User not found', error: true, success: false });
    }

    const {
      expert_id, expert_name, expert_specialization,
      expert_avatar, expert_fee, session_date,
      session_time, meeting_type, query
    } = request.body;

    if (!expert_id || !session_date || !session_time) {
      return response.status(400).json({
        message: 'expert_id, session_date and session_time are required',
        error: true, success: false
      });
    }

    const booking = new SessionBooking({
      user_id: user._id,
      expert_id,
      expert_name,
      expert_specialization,
      expert_avatar,
      expert_fee,
      session_date,
      session_time,
      meeting_type: meeting_type || 'video',
      status: 'PENDING',
      user_email: user.email,
      user_details: {
        name: user.name,
        email: user.email,
        mobile: user.mobile || 'N/A',
        id: user._id.toString()
      },
      query: query || ''
    });

    const saved = await booking.save();

    return response.status(201).json({
      message: 'Booking created successfully',
      data: saved,
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message || 'Server Error', error: true, success: false });
  }
};

// ─── Get Bookings by User ─────────────────────────────────────────────────────
export const getUserBookings = async (request, response) => {
  try {
    const userId = request.userId;

    console.log('🔵 getUserBookings hit');
    console.log('🔵 request.userId:', userId);
    console.log('🔵 request.query:', request.query);

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const { status } = request.query;
    const filter = { user_id: userId };
    if (status && status !== 'ALL') filter.status = status;

    console.log('🔍 filter:', filter);

    const bookings = await SessionBooking.find(filter).sort({ created_at: -1 });

    console.log('✅ bookings found:', bookings.length);

    return response.status(200).json({
      message: 'Bookings fetched successfully',
      data: bookings,
      error: false,
      success: true
    });
  } catch (error) {
    console.error('❌ getUserBookings error:', error);
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Get ALL Bookings (Expert) — NO role check, anyone logged in can access ──
export const getAllBookingsForExpert = async (request, response) => {
  try {
    const userId = request.userId;

    console.log('🔵 getAllBookingsForExpert hit');
    console.log('🔵 request.userId:', userId);

    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const user = await UserModel.findById(userId).select('email name role');
    console.log('🔵 logged in user:', { name: user?.name, email: user?.email, role: user?.role });

    const { status } = request.query;

    // Match by expert_id OR expert_name OR expert_email
    const filter = {
      $or: [
        { expert_id:    userId.toString() },
        { expert_name:  { $regex: new RegExp(`^${user?.name?.trim()}$`,  'i') } },
        { expert_email: { $regex: new RegExp(`^${user?.email?.trim()}$`, 'i') } }
      ]
    };

    if (status && status !== 'ALL') filter.status = status;

    console.log('🔍 expert filter:', JSON.stringify(filter));

    const bookings = await SessionBooking.find(filter).sort({ created_at: -1 });

    console.log('✅ expert bookings found:', bookings.length);

    // Show what's actually in DB to compare
    const allBookings = await SessionBooking.find({}).select('expert_id expert_name expert_email user_email status');
    console.log('📦 ALL bookings in DB:', JSON.stringify(allBookings, null, 2));

    return response.status(200).json({
      message: bookings.length === 0 ? 'No bookings found' : 'Expert bookings fetched',
      data: bookings,
      error: false,
      success: true
    });
  } catch (error) {
    console.error('❌ getAllBookingsForExpert error:', error);
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Approve Booking ──────────────────────────────────────────────────────────
export const approveBooking = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const { bookingId } = request.params;
    const { meeting_link, session_date, session_time } = request.body;

    if (!meeting_link) {
      return response.status(400).json({ message: 'Meeting link is required', error: true, success: false });
    }

    const booking = await SessionBooking.findById(bookingId);
    if (!booking) {
      return response.status(404).json({ message: 'Booking not found', error: true, success: false });
    }

    booking.status = 'APPROVED';
    booking.meeting_link = meeting_link;
    if (session_date) booking.session_date = session_date;
    if (session_time) booking.session_time = session_time;

    await booking.save();

    return response.status(200).json({
      message: 'Booking approved successfully',
      data: booking,
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Reject Booking ───────────────────────────────────────────────────────────
export const rejectBooking = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const { bookingId } = request.params;
    const { rejection_reason } = request.body;

    const booking = await SessionBooking.findById(bookingId);
    if (!booking) {
      return response.status(404).json({ message: 'Booking not found', error: true, success: false });
    }

    booking.status = 'REJECTED';
    booking.rejection_reason = rejection_reason || 'Expert unavailable at this time';
    await booking.save();

    return response.status(200).json({
      message: 'Booking rejected',
      data: booking,
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Mark Completed ───────────────────────────────────────────────────────────
export const markCompleted = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const { bookingId } = request.params;
    const booking = await SessionBooking.findById(bookingId);

    if (!booking) {
      return response.status(404).json({ message: 'Booking not found', error: true, success: false });
    }

    booking.status = 'COMPLETED';
    await booking.save();

    return response.status(200).json({
      message: 'Session marked as completed',
      data: booking,
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Cancel Booking (User) ────────────────────────────────────────────────────
export const cancelBooking = async (request, response) => {
  try {
    const userId = request.userId;
    const { bookingId } = request.params;

    const booking = await SessionBooking.findById(bookingId);
    if (!booking) {
      return response.status(404).json({ message: 'Booking not found', error: true, success: false });
    }

    if (booking.user_id.toString() !== userId.toString()) {
      return response.status(403).json({ message: 'Unauthorized to cancel this booking', error: true, success: false });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    return response.status(200).json({
      message: 'Booking cancelled',
      data: booking,
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};

// ─── Get Stats ────────────────────────────────────────────────────────────────
export const getExpertStats = async (request, response) => {
  try {
    const userId = request.userId;
    if (!userId) {
      return response.status(401).json({ message: 'Unauthorized', error: true, success: false });
    }

    const [pending, approved, completed, rejected] = await Promise.all([
      SessionBooking.countDocuments({ status: 'PENDING' }),
      SessionBooking.countDocuments({ status: 'APPROVED' }),
      SessionBooking.countDocuments({ status: 'COMPLETED' }),
      SessionBooking.countDocuments({ status: 'REJECTED' })
    ]);

    const earningsResult = await SessionBooking.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$expert_fee' } } }
    ]);

    return response.status(200).json({
      message: 'Stats fetched',
      data: {
        PENDING: pending,
        APPROVED: approved,
        COMPLETED: completed,
        REJECTED: rejected,
        totalEarnings: earningsResult[0]?.total || 0
      },
      error: false,
      success: true
    });
  } catch (error) {
    return response.status(500).json({ message: error.message, error: true, success: false });
  }
};