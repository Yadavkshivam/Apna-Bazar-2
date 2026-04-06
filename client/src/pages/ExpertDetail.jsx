import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const ExpertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  
  const [expert, setExpert] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [meetingType, setMeetingType] = useState('video');
  const [farmerQuery, setFarmerQuery] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchExpertDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate && id) {
      fetchAvailableSlots();
    }
  }, [selectedDate, id]);

  const fetchExpertDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getExpertById,
        url: SummaryApi.getExpertById.url.replace(':id', id)
      });
      if (response.data.success) {
        setExpert(response.data.data.expert);
        setReviews(response.data.data.reviews);
      }
    } catch (error) {
      toast.error('Failed to load expert details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getAvailableSlots,
        url: `${SummaryApi.getAvailableSlots.url}?expertId=${id}&date=${selectedDate}`
      });
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load available slots');
    }
  };

  const handleBooking = async () => {
    if (!user._id) {
      toast.error('Please login to book a consultation');
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await Axios({
        ...SummaryApi.createBooking,
        data: {
          expertId: id,
          date: selectedDate,
          timeSlot: selectedSlot,
          meetingType,
          farmerQuery
        }
      });

      if (response.data.success) {
        toast.success('Booking request sent successfully!');
        setShowBookingModal(false);
        setSelectedSlot(null);
        setFarmerQuery('');
        navigate('/my-consultations');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book consultation');
    } finally {
      setBookingLoading(false);
    }
  };

  // Get next 14 days for date selection
  const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-700">Expert not found</h2>
          <button
            onClick={() => navigate('/Expert')}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-xl"
          >
            Browse Experts
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/Expert')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Experts
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Expert Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Expert Profile Card */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-green-100">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={expert.profilePhoto || `https://ui-avatars.com/api/?name=${expert.name}&background=22c55e&color=fff&size=150`}
                    alt={expert.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-green-100"
                  />
                  {expert.isVerified && (
                    <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full shadow-lg flex items-center gap-1">
                      ✓ Verified
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{expert.name}</h1>
                  <p className="text-gray-500 mb-3">{expert.qualification}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500 text-xl">⭐</span>
                      <span className="font-bold text-lg">{expert.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({expert.totalReviews} reviews)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">{expert.totalConsultations} consultations</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {expert.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm font-medium rounded-full border border-green-200"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {expert.bio && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{expert.bio}</p>
                </div>
              )}
            </div>

            {/* Details Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-green-100">
                <div className="text-3xl mb-2">🎓</div>
                <div className="text-2xl font-bold text-green-600">{expert.experience}</div>
                <div className="text-gray-500 text-sm">Years Experience</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-green-100">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-lg font-bold text-green-600">{expert.languages.join(', ')}</div>
                <div className="text-gray-500 text-sm">Languages</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-green-100">
                <div className="text-3xl mb-2">⏱️</div>
                <div className="text-2xl font-bold text-green-600">{expert.meetingDuration}</div>
                <div className="text-gray-500 text-sm">Minutes/Session</div>
              </div>
              <div className="bg-white rounded-2xl p-5 text-center shadow-lg border border-green-100">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-lg font-bold text-green-600">{expert.location?.state || 'Online'}</div>
                <div className="text-gray-500 text-sm">Location</div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">⭐</span> Reviews ({reviews.length})
              </h3>
              
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📝</div>
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.farmerId?.avatar || `https://ui-avatars.com/api/?name=${review.farmerId?.name}&size=40`}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{review.farmerId?.name}</div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-gray-400 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review && <p className="text-gray-600">{review.review}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600">₹{expert.consultationFee}</div>
                <div className="text-gray-500">per consultation</div>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Select Date</h4>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {getNextDays().map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        selectedDate === day.date
                          ? 'bg-green-500 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-green-50 text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-medium">{day.dayName}</div>
                      <div className="text-lg font-bold">{day.dayNum}</div>
                      <div className="text-xs">{day.month}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Available Slots</h4>
                  {availableSlots.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No slots available on this day</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            selectedSlot?.startTime === slot.startTime
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-gray-50 hover:bg-green-50 text-gray-700'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Meeting Type */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Meeting Type</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMeetingType('video')}
                    className={`flex-1 py-3 rounded-xl text-center font-medium transition-all flex items-center justify-center gap-2 ${
                      meetingType === 'video'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    📹 Video
                  </button>
                  <button
                    onClick={() => setMeetingType('audio')}
                    className={`flex-1 py-3 rounded-xl text-center font-medium transition-all flex items-center justify-center gap-2 ${
                      meetingType === 'audio'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-green-50'
                    }`}
                  >
                    🎤 Audio
                  </button>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => setShowBookingModal(true)}
                disabled={!selectedSlot}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  selectedSlot
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Book Consultation
              </button>

              <p className="text-center text-gray-400 text-sm mt-4">
                Free cancellation up to 2 hours before
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Confirm Booking</h3>
            
            <div className="bg-green-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={expert.profilePhoto || `https://ui-avatars.com/api/?name=${expert.name}`}
                  alt=""
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <div className="font-bold text-gray-800">{expert.name}</div>
                  <div className="text-green-600 text-sm">{expert.expertise[0]}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded-xl p-3">
                  <div className="text-gray-500">Date</div>
                  <div className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-IN', { 
                    weekday: 'short', day: 'numeric', month: 'short' 
                  })}</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-gray-500">Time</div>
                  <div className="font-semibold">{selectedSlot?.startTime} - {selectedSlot?.endTime}</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-gray-500">Type</div>
                  <div className="font-semibold capitalize">{meetingType}</div>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-gray-500">Fee</div>
                  <div className="font-semibold text-green-600">₹{expert.consultationFee}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your query (optional)
              </label>
              <textarea
                value={farmerQuery}
                onChange={(e) => setFarmerQuery(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="e.g., I'm facing issues with my wheat crop..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpertDetail;