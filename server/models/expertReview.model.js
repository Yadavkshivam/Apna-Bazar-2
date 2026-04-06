import mongoose from 'mongoose';

const expertReviewSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expert',
    required: true
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpertSession',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    maxlength: 500
  },
  isHelpful: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// One review per session
expertReviewSchema.index({ sessionId: 1 }, { unique: true });

const ExpertReviewModel = mongoose.model('ExpertReview', expertReviewSchema);

export default ExpertReviewModel;