import Expert from '../models/expert.model.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const demoExperts = [
  {
    name: "Dr. Rajesh Kumar",
    email: "rajesh.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543210",
    specialization: "Crop Diseases",
    experience: 15,
    qualifications: "PhD in Plant Pathology",
    bio: "Specialized in identifying and treating crop diseases. 15+ years of experience helping farmers across North India.",
    consultationFee: 500,
    language: ["Hindi", "English", "Punjabi"],
    rating: 4.8,
    avatar: "https://ui-avatars.com/api/?name=Dr+Rajesh+Kumar&background=10b981&color=fff&size=200"
  },
  {
    name: "Dr. Priya Sharma",
    email: "priya.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543211",
    specialization: "Organic Farming",
    experience: 12,
    qualifications: "MSc Agriculture, Organic Farming Certified",
    bio: "Expert in organic farming techniques and sustainable agriculture practices. Helping farmers transition to organic methods.",
    consultationFee: 450,
    language: ["Hindi", "English"],
    rating: 4.9,
    avatar: "https://ui-avatars.com/api/?name=Dr+Priya+Sharma&background=059669&color=fff&size=200"
  },
  {
    name: "Suresh Patel",
    email: "suresh.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543212",
    specialization: "Soil Health",
    experience: 18,
    qualifications: "MSc Soil Science",
    bio: "Soil health specialist focusing on soil testing, nutrient management, and improving soil fertility naturally.",
    consultationFee: 400,
    language: ["Hindi", "English", "Gujarati"],
    rating: 4.7,
    avatar: "https://ui-avatars.com/api/?name=Suresh+Patel&background=047857&color=fff&size=200"
  },
  {
    name: "Dr. Anjali Verma",
    email: "anjali.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543213",
    specialization: "Pest Management",
    experience: 10,
    qualifications: "PhD Entomology",
    bio: "Integrated Pest Management expert. Specializing in eco-friendly pest control solutions for sustainable farming.",
    consultationFee: 550,
    language: ["Hindi", "English", "Marathi"],
    rating: 4.8,
    avatar: "https://ui-avatars.com/api/?name=Dr+Anjali+Verma&background=065f46&color=fff&size=200"
  },
  {
    name: "Vikram Singh",
    email: "vikram.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543214",
    specialization: "Irrigation & Water Management",
    experience: 14,
    qualifications: "B.Tech Agricultural Engineering",
    bio: "Expert in modern irrigation techniques, drip irrigation, and water conservation methods for optimal crop growth.",
    consultationFee: 480,
    language: ["Hindi", "English", "Haryanvi"],
    rating: 4.6,
    avatar: "https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff&size=200"
  },
  {
    name: "Dr. Meera Nair",
    email: "meera.expert@apnabazar.com",
    password: "Expert@123",
    mobile: "9876543215",
    specialization: "Horticulture",
    experience: 11,
    qualifications: "MSc Horticulture",
    bio: "Horticulture specialist focusing on fruit and vegetable cultivation, greenhouse farming, and post-harvest management.",
    consultationFee: 520,
    language: ["Hindi", "English", "Malayalam"],
    rating: 4.9,
    avatar: "https://ui-avatars.com/api/?name=Dr+Meera+Nair&background=059669&color=fff&size=200"
  }
];

const seedExperts = async () => {
  try {
    console.log('🌱 Starting to seed demo experts...');

    // Clear existing demo experts
    await Expert.deleteMany({ email: { $regex: '@apnabazar.com$' } });
    console.log('✓ Cleared existing demo experts');

    for (const expertData of demoExperts) {
      // Check if user exists
      let user = await User.findOne({ email: expertData.email });
      
      if (!user) {
        // Create user account
        const hashedPassword = await bcrypt.hash(expertData.password, 10);
        user = await User.create({
          name: expertData.name,
          email: expertData.email,
          password: hashedPassword,
          mobile: expertData.mobile,
          role: 'EXPERT',
          verify_email: true,
          status: 'Active'
        });
        console.log(`✓ Created user account for ${expertData.name}`);
      }

      // Create expert profile
      const expert = await Expert.create({
        userId: user._id,
        name: expertData.name,
        email: expertData.email,
        mobile: expertData.mobile,
        specialization: expertData.specialization,
        experience: expertData.experience,
        qualifications: expertData.qualifications,
        bio: expertData.bio,
        consultationFee: expertData.consultationFee,
        language: expertData.language,
        rating: expertData.rating,
        avatar: expertData.avatar,
        isVerified: true,
        status: 'active',
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

      console.log(`✓ Created expert profile for ${expertData.name}`);
    }

    console.log('🎉 Successfully seeded all demo experts!');
    console.log('\n📋 Demo Expert Credentials:');
    console.log('Email: [expert-email]@apnabazar.com');
    console.log('Password: Expert@123');
    console.log('\nExample: rajesh.expert@apnabazar.com / Expert@123\n');

  } catch (error) {
    console.error('❌ Error seeding experts:', error);
    throw error;
  }
};

export default seedExperts;