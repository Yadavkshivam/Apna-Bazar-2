import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  expertId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Expert',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  },
  meetingType: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  },
  farmerQuery: {
    type: String,
    default: ""
  },
  consultationFee: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },
  meetingLink: {
    type: String,
    default: ""
  },
  rejectionReason: {
    type: String,
    default: ""
  },
  notes: {
    type: String,
    default: ""
  },
  rating: {
    type: Number,
    default: 0
  },
  review: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Prevent double booking
bookingSchema.index({ expertId: 1, date: 1, 'timeSlot.startTime': 1 }, { unique: true });

const BookingModel = mongoose.model('Booking', bookingSchema);

export default BookingModel;