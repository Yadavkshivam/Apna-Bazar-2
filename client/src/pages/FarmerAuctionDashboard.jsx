import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const FarmerAuctionDashboard = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  
  const [activeTab, setActiveTab] = useState('my-auctions')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Form state for creating auction
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    quantity: '',
    unit: 'Quintals',
    quality: 'Grade A',
    description: '',
    startingPrice: '',
    minIncrement: '',
    duration: '24',
    harvestDate: '',
    images: [],
  })

  // Sample farmer's auctions
  const [myAuctions, setMyAuctions] = useState([
    {
      id: 1,
      productName: 'Premium Wheat',
      quantity: '50 Quintals',
      status: 'live',
      currentBid: 2450,
      totalBids: 23,
      timeLeft: '2h 30m',
      startingPrice: 2000,
      createdAt: '2026-01-28',
    },
    {
      id: 2,
      productName: 'Organic Rice',
      quantity: '30 Quintals',
      status: 'completed',
      finalBid: 3500,
      totalBids: 45,
      buyer: 'Sharma Traders',
      createdAt: '2026-01-25',
    },
    {
      id: 3,
      productName: 'Fresh Vegetables',
      quantity: '20 Quintals',
      status: 'upcoming',
      startingPrice: 1500,
      scheduledFor: '2026-01-29 10:00 AM',
      createdAt: '2026-01-27',
    },
  ])

  const categories = ['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices', 'Dairy', 'Other']

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateAuction = (e) => {
    e.preventDefault()
    // In production, this would send data to backend
    const newAuction = {
      id: myAuctions.length + 1,
      productName: formData.productName,
      quantity: `${formData.quantity} ${formData.unit}`,
      status: 'upcoming',
      startingPrice: Number(formData.startingPrice),
      totalBids: 0,
      scheduledFor: 'Pending Approval',
      createdAt: new Date().toISOString().split('T')[0],
    }
    setMyAuctions(prev => [newAuction, ...prev])
    setShowCreateModal(false)
    setFormData({
      productName: '',
      category: '',
      quantity: '',
      unit: 'Quintals',
      quality: 'Grade A',
      description: '',
      startingPrice: '',
      minIncrement: '',
      duration: '24',
      harvestDate: '',
      images: [],
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-700 to-green-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/auction" className="text-green-200 hover:text-white transition-colors">
                  ← Back to Auctions
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
                👨‍🌾 Farmer Dashboard
              </h1>
              <p className="text-green-200 mt-2">Manage your crop auctions and listings</p>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
            >
              ➕ Create New Auction
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">
                {myAuctions.filter(a => a.status === 'live').length}
              </div>
              <div className="text-green-200 text-sm">Live Auctions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-lime-400">
                {myAuctions.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-green-200 text-sm">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">
                ₹{myAuctions.filter(a => a.status === 'completed').reduce((acc, a) => acc + (a.finalBid || 0), 0).toLocaleString()}
              </div>
              <div className="text-green-200 text-sm">Total Earnings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-lime-400">
                {myAuctions.reduce((acc, a) => acc + a.totalBids, 0)}
              </div>
              <div className="text-green-200 text-sm">Total Bids Received</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'my-auctions', label: '📋 My Auctions' },
            { id: 'analytics', label: '📊 Analytics' },
            { id: 'orders', label: '📦 Orders' },
            { id: 'profile', label: '👤 Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* My Auctions Tab */}
        {activeTab === 'my-auctions' && (
          <div className="space-y-4">
            {myAuctions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                <div className="text-6xl mb-4">🌾</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No auctions yet</h3>
                <p className="text-gray-500 mb-4">Create your first auction to start selling</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Create Auction
                </button>
              </div>
            ) : (
              myAuctions.map(auction => (
                <div
                  key={auction.id}
                  className="bg-white rounded-2xl shadow-lg p-5 border border-green-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                        auction.status === 'live' 
                          ? 'bg-red-100' 
                          : auction.status === 'completed' 
                            ? 'bg-green-100' 
                            : 'bg-orange-100'
                      }`}>
                        {auction.status === 'live' ? '🔴' : auction.status === 'completed' ? '✅' : '🕐'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{auction.productName}</h3>
                        <p className="text-gray-500">{auction.quantity}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            auction.status === 'live' 
                              ? 'bg-red-100 text-red-600' 
                              : auction.status === 'completed' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-orange-100 text-orange-600'
                          }`}>
                            {auction.status.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-xs">Created: {auction.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {auction.status === 'live' && (
                        <>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Current Bid</div>
                            <div className="text-xl font-bold text-green-600">₹{auction.currentBid}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Bids</div>
                            <div className="text-xl font-bold text-gray-800">{auction.totalBids}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Time Left</div>
                            <div className="text-xl font-bold text-red-500">{auction.timeLeft}</div>
                          </div>
                        </>
                      )}
                      
                      {auction.status === 'completed' && (
                        <>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Final Price</div>
                            <div className="text-xl font-bold text-green-600">₹{auction.finalBid}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Buyer</div>
                            <div className="font-semibold text-gray-800">{auction.buyer}</div>
                          </div>
                        </>
                      )}
                      
                      {auction.status === 'upcoming' && (
                        <div className="text-center">
                          <div className="text-xs text-gray-500">Scheduled</div>
                          <div className="font-semibold text-orange-600">{auction.scheduledFor}</div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {auction.status === 'live' && (
                          <Link
                            to={`/auction/room/${auction.id}`}
                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                          >
                            View Room
                          </Link>
                        )}
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-green-600 text-xl">₹1,75,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Auctions Won</span>
                  <span className="font-bold text-gray-800">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Avg. Price Increase</span>
                  <span className="font-bold text-green-600">+23%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Repeat Buyers</span>
                  <span className="font-bold text-gray-800">5</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Top Products</h3>
              <div className="space-y-3">
                {['Premium Wheat', 'Basmati Rice', 'Organic Vegetables'].map((product, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{product}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${100 - (i * 25)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📦 Recent Orders</h3>
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📭</div>
              <p>No orders yet. Complete an auction to see orders here.</p>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">👤 Farmer Profile</h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-6xl">
                  👨‍🌾
                </div>
                <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                  Change Photo
                </button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'Farmer Name'}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+91 98765 43210"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Location</label>
                    <input
                      type="text"
                      defaultValue="Punjab, India"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">Farm Size</label>
                    <input
                      type="text"
                      defaultValue="25 Acres"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none"
                    />
                  </div>
                </div>
                <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Auction Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">➕ Create New Auction</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAuction} className="space-y-5">
                {/* Product Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Wheat"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                  />
                </div>

                {/* Category & Quality */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Quality</label>
                    <select
                      name="quality"
                      value={formData.quality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    >
                      <option value="Grade A">Grade A (Premium)</option>
                      <option value="Grade B">Grade B (Standard)</option>
                      <option value="Grade C">Grade C (Economy)</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 50"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    >
                      <option value="Quintals">Quintals</option>
                      <option value="Kg">Kilograms</option>
                      <option value="Tons">Tons</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your product quality, harvest details, etc."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Starting Price (₹/Quintal) *</label>
                    <input
                      type="number"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 2000"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Min. Bid Increment (₹)</label>
                    <input
                      type="number"
                      name="minIncrement"
                      value={formData.minIncrement}
                      onChange={handleInputChange}
                      placeholder="e.g., 50"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Duration & Harvest Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Auction Duration</label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    >
                      <option value="6">6 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="48">48 Hours</option>
                      <option value="72">72 Hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Harvest Date</label>
                    <input
                      type="date"
                      name="harvestDate"
                      value={formData.harvestDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-gray-500">Click to upload images</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Create Auction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FarmerAuctionDashboard
