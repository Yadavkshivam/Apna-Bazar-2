import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualifications: {
    type: String,
    default: ""
  },
  bio: {
    type: String,
    default: ""
  },
  consultationFee: {
    type: Number,
    required: true,
    default: 500
  },
  language: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalConsultations: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  availability: {
    monday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    tuesday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    wednesday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    thursday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    friday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    saturday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    },
    sunday: {
      available: { type: Boolean, default: false },
      slots: [{ type: String }]
    }
  }
}, {
  timestamps: true
});

const ExpertModel = mongoose.model('Expert', expertSchema);

export default ExpertModel;