import mongoose from 'mongoose';

const expertSessionSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  meetingToken: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  duration: {
    type: Number // in minutes
  },
  meetingType: {
    type: String,
    enum: ['audio', 'video'],
    default: 'video'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'missed', 'cancelled'],
    default: 'scheduled'
  },
  sessionNotes: {
    type: String,
    maxlength: 2000
  },
  prescription: {
    type: String,
    maxlength: 2000
  },
  recommendations: [{
    type: String
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true
});

const ExpertSessionModel = mongoose.model('ExpertSession', expertSessionSchema);

export default ExpertSessionModel;