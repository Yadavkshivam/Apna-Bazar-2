import mongoose from "mongoose"

const sessionBookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expert_id: {
    type: String,
    required: true
  },
  expert_name: { type: String, required: true },
  expert_specialization: { type: String },
  expert_avatar: { type: String },
  expert_fee: { type: Number, required: true },
  session_date: { type: String, required: true },
  session_time: { type: String, required: true },
  meeting_type: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  meeting_link: { type: String, default: null },
  rejection_reason: { type: String, default: null },
  user_email: { type: String, required: true },
  user_details: {
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    id: { type: String }
  },
  query: { type: String, default: '' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const SessionBooking = mongoose.model('SessionBooking', sessionBookingSchema);
export default SessionBooking;