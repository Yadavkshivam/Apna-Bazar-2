import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { demoExperts } from '../data/demoExperts';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const ExpertBooking = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [expert, setExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [meetingType, setMeetingType] = useState('video');
  const [query, setQuery] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user._id) {
      toast.error('Please login to book a session');
      navigate('/login');
      return;
    }
    const foundExpert = demoExperts.find(e => e._id === expertId);
    if (foundExpert) {
      setExpert(foundExpert);
    } else {
      toast.error('Expert not found');
      navigate('/Expert');
    }
  }, [expertId, navigate, user._id]);

  useEffect(() => {
    if (selectedDate && expert) {
      const dayName = new Date(selectedDate + 'T00:00:00')
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      const dayAvailability = expert.availability[dayName];
      setAvailableSlots(dayAvailability?.available ? dayAvailability.slots : []);
      setSelectedSlot('');
    }
  }, [selectedDate, expert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }
    if (step === 1) { setStep(2); return; }

    setIsSubmitting(true);
    try {
      const response = await Axios({
        ...SummaryApi.createBooking,
        data: {
          expert_id: expert._id,
          expert_name: expert.name,
          expert_specialization: expert.specialization,
          expert_avatar: expert.avatar,
          expert_fee: expert.consultationFee,
          session_date: selectedDate,
          session_time: selectedSlot,
          meeting_type: meetingType,
          query
        }
      });

      if (response.data.success) {
        toast.success('🎉 Booking request sent! Expert will confirm soon.');
        setTimeout(() => navigate('/my-consultations'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  if (!expert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Back Button */}
        <button
          onClick={() => step === 2 ? setStep(1) : navigate('/Expert')}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
        >
          ← {step === 2 ? 'Back to Booking' : 'Back to Experts'}
        </button>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[{ num: 1, label: 'Select Slot' }, { num: 2, label: 'Confirm Booking' }].map(({ num, label }) => (
            <div key={num} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step >= num ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > num ? '✓' : num}
              </div>
              <span className={`text-sm font-medium ${step >= num ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {num < 2 && <div className={`w-12 h-0.5 ${step > num ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Expert Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100 sticky top-6">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 border-4 border-green-100"
              />
              <h2 className="text-xl font-bold text-gray-800 text-center mb-1">{expert.name}</h2>
              <p className="text-green-600 font-medium text-center text-sm mb-3">{expert.specialization}</p>

              <div className="flex justify-center gap-1 mb-4">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className={star <= Math.floor(expert.rating) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                ))}
                <span className="text-gray-500 text-sm ml-1">({expert.totalReviews})</span>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><span>📚</span><span>{expert.qualifications}</span></div>
                <div className="flex items-center gap-2"><span>💼</span><span>{expert.experience} years experience</span></div>
                <div className="flex items-center gap-2"><span>✅</span><span>{expert.totalConsultations}+ consultations</span></div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {expert.language.map((lang, i) => (
                  <span key={i} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{lang}</span>
                ))}
              </div>

              <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">₹{expert.consultationFee}</div>
                <div className="text-gray-500 text-xs">per session</div>
              </div>

              <div className="mt-4 bg-blue-50 rounded-xl p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-semibold mb-1">Booking As:</p>
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Select Date</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-700"
                      required
                    />
                    {selectedDate && availableSlots.length === 0 && (
                      <p className="mt-3 text-red-500 text-sm">⚠️ Expert is not available on this day.</p>
                    )}
                  </div>

                  {availableSlots.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">⏰ Select Time Slot</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableSlots.map((slot, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-3 px-4 rounded-xl font-medium text-sm border-2 transition-all ${
                              selectedSlot === slot
                                ? 'bg-green-500 text-white border-green-500 shadow-lg'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-green-400 hover:bg-green-50'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📹 Meeting Type</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'video', icon: '📹', label: 'Video Call', desc: 'Face-to-face consultation' },
                        { value: 'audio', icon: '🎤', label: 'Audio Call', desc: 'Voice only consultation' }
                      ].map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setMeetingType(type.value)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            meetingType === type.value ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="font-semibold text-gray-800">{type.label}</div>
                          <div className="text-xs text-gray-500">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">💬 Your Query (Optional)</h3>
                    <textarea
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Describe your farming issue or question..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedDate || !selectedSlot}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl text-lg transition-all shadow-lg"
                  >
                    Continue to Confirm →
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">✅ Confirm Your Booking</h3>

                  <div className="space-y-4 mb-6">
                    {[
                      { icon: '👤', label: 'Your Name', value: user.name },
                      { icon: '📧', label: 'Your Email', value: user.email },
                      { icon: '📱', label: 'Mobile', value: user.mobile || 'Not provided' },
                      { icon: '👨‍🔬', label: 'Expert', value: expert.name },
                      { icon: '🌿', label: 'Specialization', value: expert.specialization },
                      { icon: '📅', label: 'Session Date', value: new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                      { icon: '⏰', label: 'Time Slot', value: selectedSlot },
                      { icon: '📹', label: 'Meeting Type', value: meetingType === 'video' ? 'Video Call' : 'Audio Call' },
                      { icon: '💰', label: 'Consultation Fee', value: `₹${expert.consultationFee}` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500 text-sm flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                        <span className="font-semibold text-gray-800 text-sm">{item.value}</span>
                      </div>
                    ))}
                    {query && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-500 text-sm mb-1">💬 Your Query:</p>
                        <p className="text-gray-700 text-sm">{query}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-yellow-700 text-sm">
                      ⏳ After booking, the expert will review and approve/reject your request.
                      You'll receive an email notification upon approval.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:opacity-70 text-white font-bold rounded-2xl text-lg transition-all shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        Confirming...
                      </span>
                    ) : '🎉 Confirm Booking'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertBooking;