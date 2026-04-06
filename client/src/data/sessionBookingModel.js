export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

// Get all bookings
export const getAllBookings = () => {
  return JSON.parse(localStorage.getItem('sessionBookings') || '[]');
};

// Save booking
export const saveBooking = (booking) => {
  const bookings = getAllBookings();
  bookings.push(booking);
  localStorage.setItem('sessionBookings', JSON.stringify(bookings));
  return booking;
};

// Update booking
export const updateBooking = (bookingId, updates) => {
  const bookings = getAllBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem('sessionBookings', JSON.stringify(bookings));
    return bookings[index];
  }
  return null;
};

// Get bookings by expert
export const getBookingsByExpert = (expertId, status = null) => {
  const bookings = getAllBookings();
  return bookings.filter(b =>
    b.expert_id === expertId && (status ? b.status === status : true)
  );
};

// Get bookings by user
export const getBookingsByUser = (userId) => {
  const bookings = getAllBookings();
  return bookings.filter(b => b.user_id === userId);
};

// Create new booking object
export const createBookingObject = ({ user, expert, sessionDate, sessionTime, meetingType, query }) => ({
  id: `BOOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  user_id: user._id,
  expert_id: expert._id,
  expert_name: expert.name,
  expert_specialization: expert.specialization,
  expert_avatar: expert.avatar,
  expert_fee: expert.consultationFee,
  session_date: sessionDate,
  session_time: sessionTime,
  meeting_type: meetingType,
  status: BOOKING_STATUS.PENDING,
  meeting_link: null,
  user_email: user.email,
  user_details: {
    name: user.name,
    email: user.email,
    mobile: user.mobile || 'N/A',
    id: user._id
  },
  query: query || '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});