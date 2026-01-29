import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const LiveAuction = () => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  
  const [activeTab, setActiveTab] = useState('live')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample auction data - In production, this would come from your backend
  const [auctions, setAuctions] = useState([
    {
      id: 1,
      productName: 'Premium Wheat',
      quantity: '50 Quintals',
      category: 'Grains',
      farmerName: 'Gurpreet Singh',
      farmerImage: '👨‍🌾',
      location: 'Punjab',
      startingPrice: 2000,
      currentBid: 2450,
      totalBids: 23,
      timeLeft: '2h 30m',
      status: 'live',
      image: '🌾',
      gradient: 'from-yellow-200 to-yellow-400',
      description: 'High-quality wheat harvested this season. Perfect for flour mills.',
      minIncrement: 50,
    },
    {
      id: 2,
      productName: 'Basmati Rice',
      quantity: '30 Quintals',
      category: 'Grains',
      farmerName: 'Ramesh Kumar',
      farmerImage: '👨‍🌾',
      location: 'Haryana',
      startingPrice: 2800,
      currentBid: 3200,
      totalBids: 18,
      timeLeft: '1h 15m',
      status: 'live',
      image: '🍚',
      gradient: 'from-green-200 to-green-400',
      description: 'Premium quality Basmati rice with long grains.',
      minIncrement: 100,
    },
    {
      id: 3,
      productName: 'Fresh Potatoes',
      quantity: '100 Quintals',
      category: 'Vegetables',
      farmerName: 'Suresh Yadav',
      farmerImage: '👨‍🌾',
      location: 'Uttar Pradesh',
      startingPrice: 800,
      currentBid: 800,
      totalBids: 0,
      timeLeft: '30m',
      status: 'upcoming',
      image: '🥔',
      gradient: 'from-orange-200 to-orange-400',
      description: 'Farm-fresh potatoes, ideal for chips and cooking.',
      minIncrement: 25,
    },
    {
      id: 4,
      productName: 'Organic Tomatoes',
      quantity: '20 Quintals',
      category: 'Vegetables',
      farmerName: 'Anita Devi',
      farmerImage: '👩‍🌾',
      location: 'Maharashtra',
      startingPrice: 1500,
      currentBid: 1850,
      totalBids: 12,
      timeLeft: '45m',
      status: 'live',
      image: '🍅',
      gradient: 'from-red-200 to-red-400',
      description: 'Organically grown tomatoes without pesticides.',
      minIncrement: 50,
    },
    {
      id: 5,
      productName: 'Fresh Onions',
      quantity: '40 Quintals',
      category: 'Vegetables',
      farmerName: 'Rakesh Patil',
      farmerImage: '👨‍🌾',
      location: 'Nashik',
      startingPrice: 1200,
      currentBid: 1200,
      totalBids: 0,
      timeLeft: '1h',
      status: 'upcoming',
      image: '🧅',
      gradient: 'from-purple-200 to-purple-400',
      description: 'Premium quality onions from Nashik region.',
      minIncrement: 30,
    },
    {
      id: 6,
      productName: 'Alphonso Mangoes',
      quantity: '15 Quintals',
      category: 'Fruits',
      farmerName: 'Vijay Deshmukh',
      farmerImage: '👨‍🌾',
      location: 'Ratnagiri',
      startingPrice: 5000,
      currentBid: 6200,
      totalBids: 35,
      timeLeft: '3h 20m',
      status: 'live',
      image: '🥭',
      gradient: 'from-amber-200 to-amber-400',
      description: 'Premium Alphonso mangoes, export quality.',
      minIncrement: 200,
    },
  ])

  const categories = ['all', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Spices']

  const filteredAuctions = auctions.filter(auction => {
    const matchesTab = activeTab === 'all' || auction.status === activeTab
    const matchesSearch = auction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || auction.category === selectedCategory
    return matchesTab && matchesSearch && matchesCategory
  })

  const handleJoinAuction = (auctionId) => {
    navigate(`/auction/room/${auctionId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/" className="text-purple-300 hover:text-white transition-colors">
                  ← Back to Home
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3">
                🔨 Live Crop Auctions
              </h1>
              <p className="text-purple-200 mt-2">Bid on fresh crops directly from verified farmers</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/auction/farmer-dashboard"
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold rounded-xl transition-all duration-300 text-center"
              >
                👨‍🌾 Farmer Dashboard
              </Link>
              <Link
                to="/auction/my-bids"
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all duration-300 border border-white/30 text-center"
              >
                📋 My Bids
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">{auctions.filter(a => a.status === 'live').length}</div>
              <div className="text-purple-200 text-sm">Live Auctions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-lime-400">{auctions.filter(a => a.status === 'upcoming').length}</div>
              <div className="text-purple-200 text-sm">Upcoming</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">{auctions.reduce((acc, a) => acc + a.totalBids, 0)}</div>
              <div className="text-purple-200 text-sm">Total Bids</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-lime-400">{auctions.length}</div>
              <div className="text-purple-200 text-sm">Total Listings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by product, farmer, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
                >
                  {cat === 'all' ? '🏷️ All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-t border-purple-100 pt-4">
            {[
              { id: 'live', label: '🔴 Live Now', count: auctions.filter(a => a.status === 'live').length },
              { id: 'upcoming', label: '🟠 Upcoming', count: auctions.filter(a => a.status === 'upcoming').length },
              { id: 'all', label: '📋 All', count: auctions.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      <div className="container mx-auto px-4 pb-16">
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No auctions found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <div
                key={auction.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-purple-100 hover:border-purple-300 hover:-translate-y-2"
              >
                {/* Status Badge */}
                <div className="relative">
                  <div className={`w-full h-40 bg-gradient-to-br ${auction.gradient} flex items-center justify-center text-7xl`}>
                    {auction.image}
                  </div>
                  <div className="absolute top-4 left-4">
                    {auction.status === 'live' ? (
                      <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                        🕐 {auction.timeLeft}
                      </span>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-purple-700">
                    {auction.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{auction.productName}</h3>
                  <p className="text-gray-500 text-sm mb-3">{auction.quantity}</p>
                  
                  {/* Farmer Info */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-xl">
                      {auction.farmerImage}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{auction.farmerName}</div>
                      <div className="text-xs text-gray-500">📍 {auction.location}</div>
                    </div>
                  </div>

                  {/* Bidding Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-gray-500">
                        {auction.status === 'live' ? 'Current Bid' : 'Starting Price'}
                      </div>
                      <div className="text-2xl font-bold text-purple-600">₹{auction.currentBid}/Q</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total Bids</div>
                      <div className="text-xl font-bold text-gray-800">{auction.totalBids}</div>
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600 text-sm">⏱️ Time Left</span>
                    <span className="font-bold text-purple-600">{auction.timeLeft}</span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleJoinAuction(auction.id)}
                    disabled={auction.status === 'upcoming'}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                      auction.status === 'live'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-300'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {auction.status === 'live' ? 'Join Auction →' : 'Starting Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveAuction
