import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoExperts } from '../data/demoExperts';

const Expert = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const specializations = ['All', 'Crop Diseases', 'Organic Farming', 'Soil Health', 'Pest Management', 'Irrigation & Water Management', 'Horticulture'];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setExperts(demoExperts);
      setFilteredExperts(demoExperts);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = experts;

    if (selectedSpecialization !== 'All') {
      filtered = filtered.filter(expert => expert.specialization === selectedSpecialization);
    }

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExperts(filtered);
  }, [searchTerm, selectedSpecialization, experts]);

  const handleBookConsultation = (expertId) => {
    navigate(`/expert/book/${expertId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-4">
            🌾 Agricultural Experts
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Connect with verified agricultural experts for personalized farming guidance
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search experts by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Experts Grid */}
        {filteredExperts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No experts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <div
                key={expert._id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-100 overflow-hidden"
              >
                {/* Expert Header */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white relative">
                  <div className="absolute top-4 right-4">
                    {expert.isVerified && (
                      <span className="px-3 py-1 bg-yellow-400 text-green-900 text-xs font-bold rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <img
                      src={expert.avatar}
                      alt={expert.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{expert.name}</h3>
                      <p className="text-green-100 text-sm">{expert.specialization}</p>
                    </div>
                  </div>
                </div>

                {/* Expert Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold">{expert.rating}</span>
                      <span className="text-gray-500 text-sm">({expert.totalReviews} reviews)</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      📚 {expert.qualifications}
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      💼 {expert.experience} years experience
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {expert.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {expert.language.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{expert.consultationFee}
                      </div>
                      <div className="text-gray-500 text-xs">per session</div>
                    </div>
                    <button
                      onClick={() => handleBookConsultation(expert._id)}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Book Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl mb-2">👨‍🌾</div>
            <div className="text-2xl font-bold text-green-600">{experts.length}+</div>
            <div className="text-gray-600 text-sm">Expert Advisors</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">3000+</div>
            <div className="text-gray-600 text-sm">Consultations</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-green-600">4.8</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl mb-2">🌾</div>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-gray-600 text-sm">Verified Experts</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Expert;
