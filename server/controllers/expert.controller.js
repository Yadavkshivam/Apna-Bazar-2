import ExpertModel from '../models/expert.model.js';
import BookingModel from '../models/booking.model.js';
import UserModel from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';

// Get all experts
export const getExperts = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    
    let query = { status: 'active', isVerified: true };
    
    if (specialization && specialization !== 'All') {
      query.specialization = specialization;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    const experts = await ExpertModel.find(query)
      .select('-__v')
      .sort({ rating: -1 });
    
    return res.status(200).json({
      success: true,
      data: experts,
      message: 'Experts fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch experts'
    });
  }
};

// Get expert by ID
export const getExpertById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const expert = await ExpertModel.findById(id);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: expert,
      message: 'Expert fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch expert'
    });
  }
};

// Get available slots for an expert on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { expertId, date } = req.query;
    
    const expert = await ExpertModel.findById(expertId);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }
    
    const selectedDate = new Date(date);
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const dayAvailability = expert.availability[dayName];
    
    if (!dayAvailability || !dayAvailability.available) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No slots available on this day'
      });
    }
    
    // Get booked slots for this date
    const bookedSlots = await BookingModel.find({
      expertId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot.startTime');
    
    const bookedTimes = bookedSlots.map(b => b.timeSlot.startTime);
    
    // Filter out booked slots
    const availableSlots = dayAvailability.slots.filter(slot => {
      const startTime = slot.split('-')[0];
      return !bookedTimes.includes(startTime);
    });
    
    return res.status(200).json({
      success: true,
      data: availableSlots,
      message: 'Available slots fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch available slots'
    });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { expertId, date, timeSlot, meetingType, farmerQuery } = req.body;
    
    const expert = await ExpertModel.findById(expertId);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }
    
    // Check if slot is already booked
    const existingBooking = await BookingModel.findOne({
      expertId,
      date: new Date(date),
      'timeSlot.startTime': timeSlot.split('-')[0],
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }
    
    const [startTime, endTime] = timeSlot.split('-');
    
    const booking = new BookingModel({
      farmerId: userId,
      expertId,
      date: new Date(date),
      timeSlot: { startTime, endTime },
      meetingType,
      farmerQuery,
      consultationFee: expert.consultationFee
    });
    
    await booking.save();
    
    return res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking request sent successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// Get farmer's bookings
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;
    
    let query = { farmerId: userId };
    
    if (status) {
      query.status = status;
    }
    
    const bookings = await BookingModel.find(query)
      .populate('expertId', 'name specialization avatar consultationFee')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      data: bookings,
      message: 'Bookings fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

// Get expert dashboard
export const getExpertDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    
    const expert = await ExpertModel.findOne({ userId });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get stats
    const [pendingBookings, todayBookings, completedSessions, totalEarnings] = await Promise.all([
      BookingModel.countDocuments({ expertId: expert._id, status: 'pending' }),
      BookingModel.find({
        expertId: expert._id,
        date: { $gte: today, $lt: tomorrow },
        status: 'confirmed'
      }).populate('farmerId', 'name avatar'),
      BookingModel.countDocuments({ expertId: expert._id, status: 'completed' }),
      BookingModel.aggregate([
        { $match: { expertId: expert._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$consultationFee' } } }
      ])
    ]);
    
    return res.status(200).json({
      success: true,
      data: {
        expert,
        stats: {
          pendingBookings,
          todayBookings,
          completedSessions,
          totalEarnings: totalEarnings[0]?.total || 0
        }
      },
      message: 'Dashboard fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard'
    });
  }
};

// Get expert bookings
export const getExpertBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;
    
    const expert = await ExpertModel.findOne({ userId });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }
    
    let query = { expertId: expert._id };
    
    if (status) {
      query.status = status;
    }
    
    const bookings = await BookingModel.find(query)
      .populate('farmerId', 'name avatar mobile email')
      .sort({ date: -1 });
    
    return res.status(200).json({
      success: true,
      data: bookings,
      message: 'Bookings fetched successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

// Accept booking
export const acceptBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    
    const expert = await ExpertModel.findOne({ userId });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }
    
    const booking = await BookingModel.findOne({
      _id: bookingId,
      expertId: expert._id,
      status: 'pending'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }
    
    // Generate meeting link
    const meetingId = uuidv4();
    const meetingLink = `/meeting/${meetingId}`;
    
    booking.status = 'confirmed';
    booking.meetingLink = meetingLink;
    
    await booking.save();
    
    return res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking accepted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to accept booking'
    });
  }
};

// Reject booking
export const rejectBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookingId } = req.params;
    const { reason } = req.body;
    
    const expert = await ExpertModel.findOne({ userId });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }
    
    const booking = await BookingModel.findOne({
      _id: bookingId,
      expertId: expert._id,
      status: 'pending'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already processed'
      });
    }
    
    booking.status = 'rejected';
    booking.rejectionReason = reason || 'No reason provided';
    
    await booking.save();
    
    return res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking rejected'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject booking'
    });
  }
};

// Register as expert
export const registerAsExpert = async (req, res) => {
  try {
    const userId = req.userId;
    const { specialization, experience, qualifications, bio, consultationFee, language } = req.body;
    
    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if already registered as expert
    const existingExpert = await ExpertModel.findOne({ userId });
    
    if (existingExpert) {
      return res.status(400).json({
        success: false,
        message: 'Already registered as expert'
      });
    }
    
    const expert = new ExpertModel({
      userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar: user.avatar,
      specialization,
      experience,
      qualifications,
      bio,
      consultationFee,
      language,
      availability: {
        monday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        tuesday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        wednesday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        thursday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        friday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        saturday: { available: true, slots: ['09:00-10:00', '10:00-11:00'] },
        sunday: { available: false, slots: [] }
      }
    });
    
    await expert.save();
    
    // Update user role
    user.role = 'EXPERT';
    await user.save();
    
    return res.status(201).json({
      success: true,
      data: expert,
      message: 'Registered as expert successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register as expert'
    });
  }
};

// Update availability
export const updateAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const { availability } = req.body;
    
    const expert = await ExpertModel.findOne({ userId });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert profile not found'
      });
    }
    
    expert.availability = availability;
    await expert.save();
    
    return res.status(200).json({
      success: true,
      data: expert,
      message: 'Availability updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update availability'
    });
  }
};

// Seed demo experts (for development)
export const seedDemoExperts = async (req, res) => {
  try {
    const demoExperts = [
      {
        name: "Dr. Rajesh Kumar",
        email: "rajesh.expert@apnabazar.com",
        mobile: "9876543210",
        specialization: "Crop Diseases",
        experience: 15,
        qualifications: "PhD in Plant Pathology",
        bio: "Specialized in identifying and treating crop diseases. 15+ years of experience helping farmers across North India.",
        consultationFee: 500,
        language: ["Hindi", "English", "Punjabi"],
        rating: 4.8,
        totalReviews: 245,
        avatar: "https://ui-avatars.com/api/?name=Dr+Rajesh+Kumar&background=10b981&color=fff&size=200",
        isVerified: true,
        status: 'active'
      },
      {
        name: "Dr. Priya Sharma",
        email: "priya.expert@apnabazar.com",
        mobile: "9876543211",
        specialization: "Organic Farming",
        experience: 12,
        qualifications: "MSc Agriculture, Organic Farming Certified",
        bio: "Expert in organic farming techniques and sustainable agriculture practices.",
        consultationFee: 450,
        language: ["Hindi", "English"],
        rating: 4.9,
        totalReviews: 312,
        avatar: "https://ui-avatars.com/api/?name=Dr+Priya+Sharma&background=059669&color=fff&size=200",
        isVerified: true,
        status: 'active'
      },
      {
        name: "Suresh Patel",
        email: "suresh.expert@apnabazar.com",
        mobile: "9876543212",
        specialization: "Soil Health",
        experience: 18,
        qualifications: "MSc Soil Science",
        bio: "Soil health specialist focusing on soil testing and nutrient management.",
        consultationFee: 400,
        language: ["Hindi", "English", "Gujarati"],
        rating: 4.7,
        totalReviews: 189,
        avatar: "https://ui-avatars.com/api/?name=Suresh+Patel&background=047857&color=fff&size=200",
        isVerified: true,
        status: 'active'
      },
      {
        name: "Dr. Anjali Verma",
        email: "anjali.expert@apnabazar.com",
        mobile: "9876543213",
        specialization: "Pest Management",
        experience: 10,
        qualifications: "PhD Entomology",
        bio: "Integrated Pest Management expert specializing in eco-friendly solutions.",
        consultationFee: 550,
        language: ["Hindi", "English", "Marathi"],
        rating: 4.8,
        totalReviews: 267,
        avatar: "https://ui-avatars.com/api/?name=Dr+Anjali+Verma&background=065f46&color=fff&size=200",
        isVerified: true,
        status: 'active'
      },
      {
        name: "Vikram Singh",
        email: "vikram.expert@apnabazar.com",
        mobile: "9876543214",
        specialization: "Irrigation & Water Management",
        experience: 14,
        qualifications: "B.Tech Agricultural Engineering",
        bio: "Expert in modern irrigation techniques and water conservation.",
        consultationFee: 480,
        language: ["Hindi", "English", "Haryanvi"],
        rating: 4.6,
        totalReviews: 156,
        avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff&size=200",
        isVerified: true,
        status: 'active'
      },
      {
        name: "Dr. Meera Nair",
        email: "meera.expert@apnabazar.com",
        mobile: "9876543215",
        specialization: "Horticulture",
        experience: 11,
        qualifications: "MSc Horticulture",
        bio: "Horticulture specialist focusing on fruit and vegetable cultivation.",
        consultationFee: 520,
        language: ["Hindi", "English", "Malayalam"],
        rating: 4.9,
        totalReviews: 298,
        avatar: "https://ui-avatars.com/api/?name=Dr+Meera+Nair&background=059669&color=fff&size=200",
        isVerified: true,
        status: 'active'
      }
    ];
    
    // Clear existing demo experts
    await ExpertModel.deleteMany({ email: { $regex: '@apnabazar.com$' } });
    
    // Add default availability to each expert
    const expertsWithAvailability = demoExperts.map(expert => ({
      ...expert,
      availability: {
        monday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        tuesday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        wednesday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        thursday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        friday: { available: true, slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
        saturday: { available: true, slots: ['09:00-10:00', '10:00-11:00'] },
        sunday: { available: false, slots: [] }
      }
    }));
    
    await ExpertModel.insertMany(expertsWithAvailability);
    
    return res.status(201).json({
      success: true,
      message: 'Demo experts seeded successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed demo experts'
    });
  }
};