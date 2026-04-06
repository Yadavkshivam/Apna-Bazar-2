import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';

const MyConsultations = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ ALL: 0, PENDING: 0, APPROVED: 0, COMPLETED: 0 });
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getUserBookings,
        params: { status: activeTab }
      });
      if (res.data.success) setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadStats = useCallback(async () => {
    try {
      const res = await Axios({ ...SummaryApi.getUserBookings, params: { status: 'ALL' } });
      const all = res.data.data || [];
      setStats({
        ALL: all.length,
        PENDING: all.filter(b => b.status === 'PENDING').length,
        APPROVED: all.filter(b => b.status === 'APPROVED').length,
        COMPLETED: all.filter(b => b.status === 'COMPLETED').length
      });
    } catch (error) {
      console.error('Stats load failed');
    }
  }, []);

  useEffect(() => {
    if (!user._id) {
      toast.error('Please login to view consultations');
      navigate('/login');
      return;
    }
    loadBookings();
    loadStats();
  }, [user, navigate, loadBookings, loadStats]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await Axios({
        ...SummaryApi.cancelBooking,
        url: `/api/session-booking/cancel/${bookingId}`   // dynamic bookingId
      });
      if (res.data.success) {
        toast.success('Booking cancelled');
        loadBookings();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-700 border-green-200',
      COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      CANCELLED: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return `border ${map[status] || map.PENDING}`;
  };
  
  const tabs = [
    { key: 'ALL', label: 'All', icon: '📋' },
    { key: 'PENDING', label: 'Pending', icon: '⏳' },
    { key: 'APPROVED', label: 'Approved', icon: '✅' },
    { key: 'COMPLETED', label: 'Completed', icon: '🎓' },
    { key: 'REJECTED', label: 'Rejected', icon: '❌' },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Consultations</h1>
            <p className="text-gray-500 mt-1">Track all your expert session bookings</p>
          </div>
          <Link
            to="/Expert"
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all shadow-lg"
          >
            + Book New
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', count: stats.ALL, color: 'text-gray-600' },
            { label: 'Pending', count: stats.PENDING, color: 'text-yellow-600' },
            { label: 'Approved', count: stats.APPROVED, color: 'text-green-600' },
            { label: 'Completed', count: stats.COMPLETED, color: 'text-blue-600' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow text-center border border-gray-100">
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-green-500 text-white shadow'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl shadow p-12 text-center border border-green-100">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No consultations found</h3>
              <p className="text-gray-400 text-sm mb-6">Book your first session with an agricultural expert</p>
              <Link to="/Expert"
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl inline-block">
                Explore Experts →
              </Link>
            </div>
          ) : (
            bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-2xl shadow p-5 border border-gray-100 hover:border-green-200 transition-all">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={booking.expert_avatar}
                    alt={booking.expert_name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800">{booking.expert_name}</h3>
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-green-600 text-sm font-medium mb-2">{booking.expert_specialization}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                      <span>📅 {new Date(booking.session_date + 'T00:00:00').toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short'
                      })}</span>
                      <span>⏰ {booking.session_time}</span>
                      <span>💰 ₹{booking.expert_fee}</span>
                    </div>

                    {booking.status === 'APPROVED' && booking.meeting_link && (
                      <div className="bg-green-50 rounded-xl p-3 mb-2 border border-green-100">
                        <p className="text-green-700 text-sm font-semibold mb-1">✅ Session Approved!</p>
                        <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                          🔗 Join Meeting →
                        </a>
                      </div>
                    )}

                    {booking.status === 'REJECTED' && booking.rejection_reason && (
                      <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                        <p className="text-red-600 text-sm">❌ Reason: {booking.rejection_reason}</p>
                      </div>
                    )}

                    {booking.query && (
                      <p className="text-gray-500 text-sm bg-gray-50 rounded-lg p-2 border">
                        💬 {booking.query}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(booking.created_at).toLocaleDateString('en-IN')}
                    </span>
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-xl text-sm border border-red-200 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    {booking.status === 'APPROVED' && booking.meeting_link && (
                      <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm text-center">
                        Join Now →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default MyConsultations;