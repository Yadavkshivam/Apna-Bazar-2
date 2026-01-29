import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AuctionRoom = () => {
  const { auctionId } = useParams()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)
  const chatEndRef = useRef(null)

  // Auction data - would come from API in production
  const [auction, setAuction] = useState({
    id: 1,
    productName: 'Premium Wheat',
    quantity: '50 Quintals',
    category: 'Grains',
    farmerName: 'Gurpreet Singh',
    farmerImage: '👨‍🌾',
    farmerPhone: '+91 98765 43210',
    location: 'Punjab',
    startingPrice: 2000,
    currentBid: 2450,
    minIncrement: 50,
    totalBids: 23,
    timeLeft: 9000, // seconds
    status: 'live',
    image: '🌾',
    gradient: 'from-yellow-200 to-yellow-400',
    description: 'High-quality wheat harvested this season. Perfect for flour mills. Moisture content: 12%. No pesticide residue.',
    quality: 'Grade A',
    harvestDate: '2026-01-15',
    images: ['🌾', '🌾', '🌾'],
  })

  const [bidAmount, setBidAmount] = useState(auction.currentBid + auction.minIncrement)
  const [bids, setBids] = useState([
    { id: 1, bidder: 'Sharma Traders', amount: 2450, time: '2 min ago', isHighest: true },
    { id: 2, bidder: 'Punjab Mills', amount: 2400, time: '5 min ago', isHighest: false },
    { id: 3, bidder: 'Agro Exports Ltd', amount: 2350, time: '8 min ago', isHighest: false },
    { id: 4, bidder: 'Delhi Wholesale', amount: 2300, time: '12 min ago', isHighest: false },
    { id: 5, bidder: 'Sharma Traders', amount: 2250, time: '15 min ago', isHighest: false },
  ])

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Farmer', message: 'Welcome to the auction! Feel free to ask any questions.', time: '10:00 AM', type: 'farmer' },
    { id: 2, sender: 'Punjab Mills', message: 'What is the moisture content?', time: '10:02 AM', type: 'buyer' },
    { id: 3, sender: 'Farmer', message: 'Moisture content is 12%, which is ideal.', time: '10:03 AM', type: 'farmer' },
    { id: 4, sender: 'System', message: 'New bid: ₹2,450 by Sharma Traders', time: '10:05 AM', type: 'system' },
  ])

  const [newMessage, setNewMessage] = useState('')
  const [showPlaceOrder, setShowPlaceOrder] = useState(false)
  const [timeLeft, setTimeLeft] = useState(auction.timeLeft)

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handlePlaceBid = () => {
    if (bidAmount <= auction.currentBid) {
      alert('Bid must be higher than current bid!')
      return
    }

    const newBid = {
      id: bids.length + 1,
      bidder: user?.name || 'You',
      amount: bidAmount,
      time: 'Just now',
      isHighest: true,
    }

    // Update bids
    setBids(prev => [newBid, ...prev.map(b => ({ ...b, isHighest: false }))])
    
    // Update auction
    setAuction(prev => ({
      ...prev,
      currentBid: bidAmount,
      totalBids: prev.totalBids + 1,
    }))

    // Add system message
    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'System',
      message: `New bid: ₹${bidAmount.toLocaleString()} by ${user?.name || 'You'}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'system',
    }])

    // Update bid amount
    setBidAmount(bidAmount + auction.minIncrement)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setChatMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: user?.name || 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'buyer',
    }])
    setNewMessage('')
  }

  const handleAcceptBid = () => {
    setShowPlaceOrder(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link to="/auction" className="text-purple-300 hover:text-white transition-colors">
                ← Back
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">{auction.productName}</h1>
                <p className="text-purple-300 text-sm">{auction.quantity} • {auction.location}</p>
              </div>
            </div>
            
            {/* Timer */}
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl font-mono text-xl font-bold ${
                timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-white/20'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <span className="px-3 py-1 bg-red-500 rounded-full text-sm font-bold animate-pulse">
                🔴 LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Product Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-purple-100">
              <div className={`w-full h-48 bg-gradient-to-br ${auction.gradient} flex items-center justify-center text-8xl`}>
                {auction.image}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {auction.category}
                  </span>
                  <span className="text-sm text-gray-500">{auction.quality}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{auction.productName}</h2>
                <p className="text-gray-600 text-sm mb-4">{auction.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-semibold">{auction.quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Harvest Date</span>
                    <span className="font-semibold">{auction.harvestDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Starting Price</span>
                    <span className="font-semibold">₹{auction.startingPrice}/Q</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Min Increment</span>
                    <span className="font-semibold text-purple-600">₹{auction.minIncrement}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Farmer Card */}
            <div className="bg-white rounded-3xl shadow-lg p-5 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Seller Information</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl">
                  {auction.farmerImage}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-800">{auction.farmerName}</div>
                  <div className="text-gray-500 text-sm">📍 {auction.location}</div>
                  <div className="text-green-600 text-sm font-medium">✓ Verified Farmer</div>
                </div>
              </div>
              <button className="w-full py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors">
                📞 Contact Farmer
              </button>
            </div>
          </div>

          {/* Middle Column - Bidding */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Bid Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl shadow-lg p-6 text-white">
              <div className="text-center mb-6">
                <div className="text-purple-200 text-sm mb-1">Current Highest Bid</div>
                <div className="text-5xl font-extrabold mb-2">₹{auction.currentBid.toLocaleString()}</div>
                <div className="text-purple-200">per Quintal</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{auction.totalBids}</div>
                  <div className="text-purple-200 text-xs">Total Bids</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{bids[0]?.bidder?.split(' ')[0] || '-'}</div>
                  <div className="text-purple-200 text-xs">Highest Bidder</div>
                </div>
              </div>

              {/* Bid Input */}
              <div className="space-y-4">
                <div>
                  <label className="text-purple-200 text-sm mb-2 block">Your Bid (₹ per Quintal)</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBidAmount(prev => Math.max(auction.currentBid + auction.minIncrement, prev - auction.minIncrement))}
                      className="px-4 py-3 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="flex-1 px-4 py-3 bg-white/20 rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                      onClick={() => setBidAmount(prev => prev + auction.minIncrement)}
                      className="px-4 py-3 bg-white/20 rounded-xl font-bold hover:bg-white/30 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePlaceBid}
                  disabled={timeLeft === 0}
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔨 Place Bid
                </button>

                <div className="text-center text-purple-200 text-xs">
                  Total: ₹{(bidAmount * 50).toLocaleString()} for {auction.quantity}
                </div>
              </div>
            </div>

            {/* Quick Bid Buttons */}
            <div className="bg-white rounded-3xl shadow-lg p-5 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Quick Bid</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 5].map(multiplier => (
                  <button
                    key={multiplier}
                    onClick={() => setBidAmount(auction.currentBid + (auction.minIncrement * multiplier))}
                    className="py-3 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-colors"
                  >
                    +₹{auction.minIncrement * multiplier}
                  </button>
                ))}
              </div>
            </div>

            {/* Bid History */}
            <div className="bg-white rounded-3xl shadow-lg p-5 border border-purple-100">
              <h3 className="font-bold text-gray-800 mb-4">Bid History</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-none">
                {bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      index === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index === 0 ? '👑' : index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{bid.bidder}</div>
                        <div className="text-xs text-gray-500">{bid.time}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${index === 0 ? 'text-yellow-600' : 'text-gray-700'}`}>
                      ₹{bid.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Chat */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg border border-purple-100 h-full flex flex-col">
              <div className="p-5 border-b border-purple-100">
                <h3 className="font-bold text-gray-800">💬 Live Chat</h3>
                <p className="text-gray-500 text-sm">Ask questions to the farmer</p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96 lg:max-h-[500px]">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'buyer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      msg.type === 'farmer' 
                        ? 'bg-green-100 text-green-800' 
                        : msg.type === 'system'
                          ? 'bg-purple-100 text-purple-800 text-center w-full'
                          : 'bg-purple-600 text-white'
                    }`}>
                      {msg.type !== 'system' && (
                        <div className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs opacity-50 mt-1">{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              
              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Accept Bid Button for Farmer */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-1">Satisfied with the current bid?</h3>
              <p className="text-green-100">Accept the bid and proceed to finalize the deal</p>
            </div>
            <button
              onClick={handleAcceptBid}
              className="px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              ✓ Accept Bid & Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Place Order Modal */}
      {showPlaceOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Confirm Order</h2>
                <p className="text-gray-500">Review and confirm your purchase</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Product</span>
                  <span className="font-semibold">{auction.productName}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold">{auction.quantity}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Price per Quintal</span>
                  <span className="font-semibold text-purple-600">₹{auction.currentBid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Seller</span>
                  <span className="font-semibold">{auction.farmerName}</span>
                </div>
                <div className="flex justify-between p-4 bg-purple-100 rounded-xl">
                  <span className="font-bold text-purple-800">Total Amount</span>
                  <span className="font-bold text-purple-800 text-xl">₹{(auction.currentBid * 50).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPlaceOrder(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/auction/order-success')}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuctionRoom
