import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { demoExperts } from '../data/demoExperts';

import { sendApprovalEmail, sendRejectionEmail } from '../utils/sendBookingEmail';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const ExpertDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ PENDING: 0, APPROVED: 0, COMPLETED: 0, REJECTED: 0, totalEarnings: 0 });
  const [activeTab, setActiveTab] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');   // ← only ONE declaration
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state => state.user);


  const generateMeetingLink = useCallback((booking) => {
    const expertId = booking.expert_id;
    const userId   = booking.user_details?.id || booking.user_id;
    const meetingId = `expert-${expertId}-user-${userId}-${Date.now()}`;
    const link = `https://meet.jit.si/${meetingId}`;
    setMeetingLink(link);   // ← correct way to set state
    console.log('🔗 Generated meeting link:', link);
  }, []);

  const expertProfile = demoExperts.find(
    e => e.email === user.email
  ) || demoExperts[0];

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryApi.getExpertBookings,
        params: { status: activeTab }
      });
      console.log("here ",res.data)
      if (res.data.success) setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadStats = useCallback(async () => {
    try {
      const res = await Axios({ ...SummaryApi.getExpertStats });
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error('Stats load failed');
    }
  }, []);

  useEffect(() => {
    if (!user._id) { navigate('/login'); return; }
    if (user.role !== 'EXPERT') { toast.error('Access denied.'); navigate('/'); return; }
    loadBookings();
    loadStats();
  }, [user, navigate, loadBookings, loadStats]);

  const handleApprove = async () => {
    if (!meetingLink.trim()) { toast.error('Please provide a meeting link'); return; }
    setIsProcessing(true);
    try {
      const res = await Axios({
        ...SummaryApi.approveBooking,
        url: `/api/session-booking/expert/approve/${selectedBooking._id}`,  // dynamic id
        data: {
          meeting_link: meetingLink,
          session_date: newDate || selectedBooking.session_date,
          session_time: newTime || selectedBooking.session_time
        }
      });
      if (res.data.success) {
        toast.success('✅ Session Approved!');
        closeModal();
        loadBookings();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const res = await Axios({
        ...SummaryApi.rejectBooking,
        url: `/api/session-booking/expert/reject/${selectedBooking._id}`,   // dynamic id
        data: { rejection_reason: rejectReason || 'Expert unavailable at this time' }
      });
      if (res.data.success) {
        toast.success('Booking rejected.');
        closeModal();
        loadBookings();
        loadStats();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkCompleted = async (bookingId) => {
    try {
      const res = await Axios({
        ...SummaryApi.markCompleted,
        url: `/api/session-booking/expert/complete/${bookingId}`   // dynamic id
      });
      if (res.data.success) {
        toast.success('Session marked as completed!');
        loadBookings();
        loadStats();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedBooking(null);
    setMeetingLink('');
    setNewDate('');
    setNewTime('');
    setRejectReason('');
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      APPROVED: 'bg-green-100 text-green-700 border border-green-200',
      COMPLETED: 'bg-blue-100 text-blue-700 border border-blue-200',
      REJECTED: 'bg-red-100 text-red-700 border border-red-200'
    };
    return map[status] || map.PENDING;
  };

  const tabs = [
    { key: 'PENDING', label: 'Pending', icon: '⏳' },
    { key: 'APPROVED', label: 'Approved', icon: '✅' },
    { key: 'COMPLETED', label: 'Completed', icon: '🎓' },
    { key: 'REJECTED', label: 'Rejected', icon: '❌' },
    { key: 'ALL', label: 'All', icon: '📋' }
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Expert Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, <span className="text-green-600 font-semibold">{user.name}</span> 👋</p>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow border border-green-100">
            <img src={expertProfile.avatar} alt="" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{expertProfile.name}</p>
              <p className="text-green-600 text-xs">{expertProfile.specialization}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { icon: '⏳', count: stats.PENDING, label: 'Pending', color: 'border-yellow-200 text-yellow-600' },
            { icon: '✅', count: stats.APPROVED, label: 'Approved', color: 'border-green-200 text-green-600' },
            { icon: '🎓', count: stats.COMPLETED, label: 'Completed', color: 'border-blue-200 text-blue-600' },
            { icon: '❌', count: stats.REJECTED, label: 'Rejected', color: 'border-red-200 text-red-600' },
            { icon: '💰', count: `₹${stats.totalEarnings}`, label: 'Earnings', color: 'border-purple-200 text-purple-600' },
          ].map((item, i) => (
            <div key={i} className={`bg-white rounded-2xl p-4 shadow border ${item.color.split(' ')[0]}`}>
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className={`text-xl font-bold ${item.color.split(' ')[1]}`}>{item.count}</div>
              <div className="text-gray-500 text-xs">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                  : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === 'PENDING' && stats.PENDING > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.PENDING}</span>
              )}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {tabs.find(t => t.key === activeTab)?.icon} {tabs.find(t => t.key === activeTab)?.label} Sessions
            <span className="ml-2 text-sm font-normal text-gray-400">({bookings.length})</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No {activeTab.toLowerCase()} sessions</h3>
              <p className="text-gray-400 text-sm">
                {activeTab === 'PENDING' ? 'New booking requests will appear here.' : 'No bookings in this category yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking._id}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                        👨‍🌾
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-800">{booking.user_details?.name}</h4>
                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">#{booking._id.slice(-8)}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1 truncate"><span>📧</span><span className="truncate">{booking.user_email}</span></span>
                        <span className="flex items-center gap-1"><span>📱</span><span>{booking.user_details?.mobile}</span></span>
                        <span className="flex items-center gap-1"><span>📅</span>
                          <span>{new Date(booking.session_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </span>
                        <span className="flex items-center gap-1"><span>⏰</span><span>{booking.session_time}</span></span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-gray-600 border">
                          {booking.meeting_type === 'video' ? '📹 Video' : '🎤 Audio'}
                        </span>
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-green-600 font-semibold border border-green-100">
                          ₹{booking.expert_fee}
                        </span>
                        <span className="px-2 py-1 bg-white rounded-lg text-xs text-gray-500 border">
                          🕐 {new Date(booking.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      {booking.query && (
                        <div className="bg-white rounded-xl p-3 border border-gray-100 text-sm text-gray-600">
                          <span className="font-medium text-gray-700">💬 Query: </span>{booking.query}
                        </div>
                      )}

                      {booking.status === 'APPROVED' && booking.meeting_link && (
                        <div className="mt-2 flex items-center gap-2 bg-green-50 rounded-xl p-2 border border-green-200">
                          <span className="text-green-600 text-sm font-medium">🔗 Meeting:</span>
                          <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate">{booking.meeting_link}</a>
                        </div>
                      )}

                      {booking.status === 'REJECTED' && booking.rejection_reason && (
                        <p className="mt-2 text-red-500 text-sm bg-red-50 rounded-xl p-2 border border-red-100">
                          ❌ Reason: {booking.rejection_reason}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                      <button onClick={() => { setSelectedBooking(booking); setModalType('view'); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-sm transition-all">
                        👁 View
                      </button>
                      {booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              generateMeetingLink(booking);  // ← auto-generates link
                              setModalType('approve');
                            }}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl text-sm transition-all"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => { setSelectedBooking(booking); setModalType('reject'); }}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-all"
                          >
                            ✗ Reject
                          </button>
                        </>
                      )}
                      {booking.status === 'APPROVED' && (
                        <>
                          <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm text-center transition-all">
                            🎥 Start
                          </a>
                          <button onClick={() => handleMarkCompleted(booking._id)}
                            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl text-sm transition-all">
                            ✅ Done
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* APPROVE MODAL */}
      {modalType === 'approve' && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-3xl text-white">
              <h3 className="text-xl font-bold">✅ Approve Session</h3>
              <p className="text-green-100 text-sm mt-1">Set meeting details for {selectedBooking.user_details?.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">🔗 Meeting Link *</label>
                <input type="url" value={meetingLink} onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">📅 Confirm/Change Date</label>
                <input type="date" value={newDate || selectedBooking.session_date} onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">⏰ Confirm/Change Time</label>
                <input type="text" value={newTime || selectedBooking.session_time} onChange={e => setNewTime(e.target.value)}
                  placeholder="09:00-10:00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500" />
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 border border-blue-100">
                📧 Approval email will be sent to <strong>{selectedBooking.user_email}</strong>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleApprove} disabled={isProcessing || !meetingLink.trim()}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all">
                  {isProcessing ? 'Processing...' : '✓ Confirm Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {modalType === 'reject' && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 rounded-t-3xl text-white">
              <h3 className="text-xl font-bold">❌ Reject Session</h3>
              <p className="text-red-100 text-sm mt-1">Booking by {selectedBooking.user_details?.name}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Rejection Reason (Optional)</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g., Not available on this date..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 resize-none" />
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-700 border border-orange-100">
                📧 Rejection email will be sent to <strong>{selectedBooking.user_email}</strong>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleReject} disabled={isProcessing}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-bold rounded-xl">
                  {isProcessing ? 'Processing...' : '✗ Confirm Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {modalType === 'view' && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl text-white">
              <h3 className="text-xl font-bold">📋 Booking Details</h3>
              <p className="text-green-100 text-sm mt-1">#{selectedBooking._id}</p>
            </div>
            <div className="p-6 space-y-3">
              {[
                { icon: '👤', label: 'Farmer Name', value: selectedBooking.user_details?.name },
                { icon: '📧', label: 'Email', value: selectedBooking.user_email },
                { icon: '📱', label: 'Mobile', value: selectedBooking.user_details?.mobile },
                { icon: '📅', label: 'Session Date', value: new Date(selectedBooking.session_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) },
                { icon: '⏰', label: 'Time Slot', value: selectedBooking.session_time },
                { icon: '📹', label: 'Meeting Type', value: selectedBooking.meeting_type },
                { icon: '💰', label: 'Fee', value: `₹${selectedBooking.expert_fee}` },
                { icon: '📊', label: 'Status', value: selectedBooking.status },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-500 text-sm">{item.icon} {item.label}</span>
                  <span className="font-semibold text-gray-800 text-sm">{item.value}</span>
                </div>
              ))}
              {selectedBooking.query && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-500 text-sm mb-1 font-semibold">💬 Query:</p>
                  <p className="text-gray-700 text-sm">{selectedBooking.query}</p>
                </div>
              )}
              {selectedBooking.meeting_link && (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-gray-500 text-sm mb-1 font-semibold">🔗 Meeting Link:</p>
                  <a href={selectedBooking.meeting_link} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all">{selectedBooking.meeting_link}</a>
                </div>
              )}
              <button onClick={() => setModalType(null)}
                className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpertDashboard;