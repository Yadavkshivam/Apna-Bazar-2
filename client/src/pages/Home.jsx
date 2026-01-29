import React,{ useState, useRef } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import {Link, useNavigate} from 'react-router-dom'
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import DraggableBar from '../components/dragBar' 
import AiBot from '../components/AiBot'
import NewsSlider from '../components/News'


const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductListpage = (id,cat)=>{
      console.log(id,cat)
      const subcategory = subCategoryData.find(sub =>{
        const filterData = sub.category.some(c => {
          return c._id == id
        })
        return filterData ? true : null
      })
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`

      navigate(url)
      console.log(url)
  }

  return (
  <section className="bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 min-h-screen">



    {/* Navigation Bar */}
    <div className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border-b border-green-200 shadow-sm">
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-8 md:gap-12 px-4 py-3">
        <a href="#services" className="relative group text-green-800 font-semibold text-sm sm:text-base md:text-lg tracking-wide cursor-pointer">
          <span className="group-hover:text-green-600 transition-colors duration-300">🌾 Services</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#products" className="relative group text-green-800 font-semibold text-sm sm:text-base md:text-lg tracking-wide cursor-pointer">
          <span className="group-hover:text-green-600 transition-colors duration-300">🛒 Products</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#bidding" className="relative group text-green-800 font-semibold text-sm sm:text-base md:text-lg tracking-wide cursor-pointer">
          <span className="group-hover:text-green-600 transition-colors duration-300">🔨 Live Bidding</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#news" className="relative group text-green-800 font-semibold text-sm sm:text-base md:text-lg tracking-wide cursor-pointer">
          <span className="group-hover:text-green-600 transition-colors duration-300">📰 News</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>
    </div>



   <div>
      <AiBot/>
    </div> 

    {/* Hero Section */}
    <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 py-12 sm:py-16 md:py-20 px-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-lime-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block px-4 py-2 bg-yellow-400/20 backdrop-blur-sm rounded-full mb-6 border border-yellow-400/30">
            <span className="text-yellow-300 text-sm sm:text-base font-medium">🌱 Farm Fresh • Direct from Farmers</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
            Empowering <span className="text-yellow-400">Farmers</span>,<br/>
            Connecting <span className="text-lime-400">Buyers</span>
          </h1>
          
          <p className="text-green-100 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Sell your crops directly, participate in live bidding, and connect with buyers across the nation. No middlemen, better prices!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auction/farmer-dashboard" className="group relative px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                🚜 Start Selling
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link to="/auction" className="group px-8 py-4 bg-transparent border-2 border-white/50 hover:border-white text-white font-bold rounded-full transition-all duration-300 hover:bg-white/10 w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                🔨 Join Live Auction
              </span>
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400">10K+</div>
            <div className="text-green-200 text-sm">Active Farmers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-lime-400">50K+</div>
            <div className="text-green-200 text-sm">Products Listed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-400">₹5Cr+</div>
            <div className="text-green-200 text-sm">Farmer Earnings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold text-lime-400">100+</div>
            <div className="text-green-200 text-sm">Live Auctions</div>
          </div>
        </div>
      </div>
    </div>

    {/* Draggable Bar */}
    <div className="fixed z-50">
      <DraggableBar />
    </div>

    {/* Features Section */}
    <div className="py-16 px-4 bg-gradient-to-b from-white to-green-50" id="services">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 mb-4">
            🌾 How Apna Bazar Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A complete ecosystem for farmers and buyers to connect, trade, and grow together
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                👨‍🌾
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Create Account</h3>
              <p className="text-gray-600 text-sm">Register as a farmer or buyer in minutes and start your journey</p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                📦
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">List Your Crops</h3>
              <p className="text-gray-600 text-sm">Upload photos, set prices, and showcase your fresh produce</p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                🔨
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Live Bidding</h3>
              <p className="text-gray-600 text-sm">Participate in real-time auctions and get the best prices</p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-green-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                🤝
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Direct Connect</h3>
              <p className="text-gray-600 text-sm">Chat directly with buyers/sellers, no middlemen involved</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Live Bidding Section */}
    <div className="py-16 px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800" id="bidding">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-300 rounded-full text-sm font-semibold mb-4 border border-yellow-400/30">
            🔴 Live Now
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
            🔨 Live Crop Bidding Room
          </h2>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Join active auctions and bid on fresh crops directly from farmers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Bidding Card 1 */}
          <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">🔴 LIVE</span>
              <span className="text-purple-300 text-sm">⏱ 2h 30m left</span>
            </div>
            <div className="w-full h-32 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-2xl mb-4 flex items-center justify-center text-6xl">
              🌾
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Wheat - 50 Quintals</h3>
            <p className="text-purple-300 text-sm mb-4">📍 Punjab | Farmer: Gurpreet Singh</p>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-purple-300 text-xs">Current Bid</div>
                <div className="text-2xl font-bold text-yellow-400">₹2,450/Q</div>
              </div>
              <div className="text-right">
                <div className="text-purple-300 text-xs">Total Bids</div>
                <div className="text-xl font-bold text-white">23</div>
              </div>
            </div>
            <Link to="/auction/room/1" className="block w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-center">
              Place Bid →
            </Link>
          </div>
          
          {/* Bidding Card 2 */}
          <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">🔴 LIVE</span>
              <span className="text-purple-300 text-sm">⏱ 1h 15m left</span>
            </div>
            <div className="w-full h-32 bg-gradient-to-br from-green-200 to-green-400 rounded-2xl mb-4 flex items-center justify-center text-6xl">
              🍚
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Basmati Rice - 30 Quintals</h3>
            <p className="text-purple-300 text-sm mb-4">📍 Haryana | Farmer: Ramesh Kumar</p>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-purple-300 text-xs">Current Bid</div>
                <div className="text-2xl font-bold text-yellow-400">₹3,200/Q</div>
              </div>
              <div className="text-right">
                <div className="text-purple-300 text-xs">Total Bids</div>
                <div className="text-xl font-bold text-white">18</div>
              </div>
            </div>
            <Link to="/auction/room/2" className="block w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 text-center">
              Place Bid →
            </Link>
          </div>
          
          {/* Bidding Card 3 */}
          <div className="group bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">🟠 Starting Soon</span>
              <span className="text-purple-300 text-sm">⏱ Starts in 30m</span>
            </div>
            <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-orange-400 rounded-2xl mb-4 flex items-center justify-center text-6xl">
              🥔
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fresh Potatoes - 100 Quintals</h3>
            <p className="text-purple-300 text-sm mb-4">📍 UP | Farmer: Suresh Yadav</p>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-purple-300 text-xs">Starting Price</div>
                <div className="text-2xl font-bold text-yellow-400">₹800/Q</div>
              </div>
              <div className="text-right">
                <div className="text-purple-300 text-xs">Interested</div>
                <div className="text-xl font-bold text-white">45</div>
              </div>
            </div>
            <button className="w-full py-3 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30">
              Set Reminder 🔔
            </button>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link to="/auction" className="px-8 py-3 bg-transparent border-2 border-white/50 hover:border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 inline-block">
            View All Auctions →
          </Link>
        </div>
      </div>
    </div>

    {/* Products Section */}
    <div className="px-4 sm:px-6 md:px-20 py-20 bg-gradient-to-b from-amber-50 via-orange-50/50 to-yellow-50 relative overflow-hidden" id="products">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-300/40 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-pink-300/30 to-transparent rounded-full blur-3xl translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-t from-yellow-300/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-bl from-rose-200/40 to-transparent rounded-full blur-2xl"></div>
      
      <div className="text-center mb-16 relative z-10">
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 text-orange-700 rounded-full text-sm font-semibold mb-6 shadow-md border border-orange-200/50 animate-pulse">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          🌾 Fresh From Farm
        </span>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent tracking-wide mb-5">
          🛒 Shop by Category
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Explore fresh vegetables, fruits, grains, and more - directly sourced from verified farmers
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <span className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></span>
          <span className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
          <span className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6 md:gap-8 relative z-10">
        {
          loadingCategory ? (
            new Array(10).fill(null).map((c, index) => (
              <div
                key={index + 'loadingcategory'}
                className="bg-white/90 backdrop-blur-sm border border-orange-200/50 rounded-3xl p-5 sm:p-6 min-h-52 grid gap-4 shadow-xl animate-pulse"
              >
                <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 min-h-32 rounded-2xl"></div>
                <div className="bg-gradient-to-r from-orange-200 to-amber-200 h-7 rounded-xl"></div>
              </div>
            ))
          ) : (
            categoryData.map((cat, index) => {
              const colors = [
                { bg: 'from-orange-50 via-amber-50 to-yellow-50', border: 'border-orange-200', hover: 'hover:border-orange-400 hover:shadow-orange-200/50', text: 'text-orange-600', badge: 'bg-orange-50 border-orange-200 text-orange-600' },
                { bg: 'from-rose-50 via-pink-50 to-red-50', border: 'border-rose-200', hover: 'hover:border-rose-400 hover:shadow-rose-200/50', text: 'text-rose-600', badge: 'bg-rose-50 border-rose-200 text-rose-600' },
                { bg: 'from-violet-50 via-purple-50 to-fuchsia-50', border: 'border-violet-200', hover: 'hover:border-violet-400 hover:shadow-violet-200/50', text: 'text-violet-600', badge: 'bg-violet-50 border-violet-200 text-violet-600' },
                { bg: 'from-cyan-50 via-teal-50 to-emerald-50', border: 'border-cyan-200', hover: 'hover:border-cyan-400 hover:shadow-cyan-200/50', text: 'text-cyan-600', badge: 'bg-cyan-50 border-cyan-200 text-cyan-600' },
                { bg: 'from-blue-50 via-indigo-50 to-sky-50', border: 'border-blue-200', hover: 'hover:border-blue-400 hover:shadow-blue-200/50', text: 'text-blue-600', badge: 'bg-blue-50 border-blue-200 text-blue-600' },
              ];
              const color = colors[index % colors.length];
              
              return (
              <div
                key={cat._id + 'displayCategory'}
                className={`group cursor-pointer bg-white/95 backdrop-blur-sm ${color.border} border-2 rounded-3xl shadow-lg 
                hover:shadow-2xl ${color.hover} transition-all duration-500 p-5 sm:p-6 
                hover:-translate-y-4 hover:scale-[1.02] relative overflow-hidden`}
                onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {/* Colorful Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color.bg} opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-3xl`}></div>
                
                {/* Rainbow Corner Decorations */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-300/40 via-orange-300/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-violet-300/30 via-blue-300/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                
                {/* Sparkle Effect */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-yellow-500 text-lg animate-pulse">✨</span>
                </div>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{animationDelay: '0.2s'}}>
                  <span className="text-pink-400 text-sm animate-ping">💫</span>
                </div>
                
                <div className={`relative flex justify-center items-center bg-gradient-to-br ${color.bg} rounded-2xl p-4 sm:p-5 border ${color.border} group-hover:border-opacity-80 transition-all duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <img
                    src={cat.image}
                    className="w-full h-28 sm:h-32 md:h-36 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg relative z-10"
                    alt={cat.name}
                  />
                </div>

                <p className={`text-center mt-4 sm:mt-5 font-bold text-gray-800 text-sm sm:text-base md:text-lg group-hover:${color.text} transition-colors duration-300 relative z-10`}>
                  {cat.name}
                </p>
                
                <div className="text-center mt-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold ${color.badge} px-3 py-1.5 rounded-full border`}>
                    View Products 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            )})
          )
        }
      </div>
    </div>

    {/* Category Wise Products */}
    <div className="py-20 px-3 sm:px-6 md:px-16 bg-gradient-to-b from-yellow-50 via-orange-50/50 to-rose-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-orange-400 rounded-full animate-ping opacity-40"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-violet-400 rounded-full animate-ping opacity-25" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-35" style={{animationDelay: '1.5s'}}></div>
      
      {/* Floating Colorful Icons */}
      <div className="absolute top-32 right-1/4 text-4xl opacity-30 animate-bounce" style={{animationDuration: '3s'}}>🥕</div>
      <div className="absolute top-1/2 left-10 text-3xl opacity-25 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>🍅</div>
      <div className="absolute bottom-40 right-16 text-4xl opacity-30 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>🥬</div>
      <div className="absolute top-24 left-1/3 text-3xl opacity-20 animate-bounce" style={{animationDuration: '4.5s', animationDelay: '0.8s'}}>🍇</div>
      <div className="absolute bottom-60 left-20 text-4xl opacity-25 animate-bounce" style={{animationDuration: '3.2s', animationDelay: '1.2s'}}>🌽</div>
      
      <div className="text-center mb-16 relative z-10">
        <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-100 via-pink-100 to-orange-100 text-rose-700 rounded-full text-sm font-semibold mb-6 shadow-md border border-rose-200/50">
          <span className="text-lg">🌈</span>
          Explore More
        </span>
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 bg-clip-text text-transparent tracking-wide mb-5">
          🥬 Fresh Products For You
        </h3>
        <p className="text-gray-700 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Hand-picked selections from our farmer community
        </p>
        
        {/* Colorful Decorative Line */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent to-rose-400 rounded-full"></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
          <div className="w-8 h-1 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full"></div>
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
          <div className="w-12 h-1 bg-gradient-to-l from-transparent to-yellow-400 rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-20 sm:space-y-24 relative z-10">
        {
          categoryData?.map((c, index) => {
            const cardColors = [
              { gradient: 'from-orange-400 via-amber-400 to-yellow-400', bg: 'from-orange-100/60', corner1: 'from-orange-200/60', corner2: 'from-amber-200/50', badge: 'from-orange-500 to-amber-500' },
              { gradient: 'from-rose-400 via-pink-400 to-red-400', bg: 'from-rose-100/60', corner1: 'from-rose-200/60', corner2: 'from-pink-200/50', badge: 'from-rose-500 to-pink-500' },
              { gradient: 'from-violet-400 via-purple-400 to-fuchsia-400', bg: 'from-violet-100/60', corner1: 'from-violet-200/60', corner2: 'from-purple-200/50', badge: 'from-violet-500 to-purple-500' },
              { gradient: 'from-cyan-400 via-teal-400 to-emerald-400', bg: 'from-cyan-100/60', corner1: 'from-cyan-200/60', corner2: 'from-teal-200/50', badge: 'from-cyan-500 to-teal-500' },
              { gradient: 'from-blue-400 via-indigo-400 to-sky-400', bg: 'from-blue-100/60', corner1: 'from-blue-200/60', corner2: 'from-indigo-200/50', badge: 'from-blue-500 to-indigo-500' },
            ];
            const cardColor = cardColors[index % cardColors.length];
            
            return (
            <div
              key={c?._id + "CategorywiseProduct"}
              className="relative group bg-white/90 backdrop-blur-sm rounded-[2rem] p-5 sm:p-7 md:p-10 lg:p-12
                shadow-xl hover:shadow-2xl transition-all duration-700 
                border-2 border-orange-100/80 hover:border-orange-300/80 overflow-hidden
                transform hover:-translate-y-2"
            >
              {/* Colorful Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-r ${cardColor.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-sm`}></div>
              <div className="absolute inset-[3px] rounded-[2rem] bg-white/98 -z-10"></div>
              
              {/* Colorful Corner Decorations */}
              <div className={`absolute top-0 left-0 w-44 h-44 bg-gradient-to-br ${cardColor.corner1} via-transparent to-transparent rounded-br-full opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`}></div>
              <div className={`absolute bottom-0 right-0 w-52 h-52 bg-gradient-to-tl ${cardColor.corner2} via-transparent to-transparent rounded-tl-full opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700`}></div>
              <div className="absolute top-1/2 right-0 w-28 h-28 bg-gradient-to-l from-yellow-200/40 to-transparent rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-1/3 left-0 w-24 h-24 bg-gradient-to-r from-pink-200/30 to-transparent rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-600"></div>
              
              {/* Rainbow Shine Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none rounded-[2rem]" />

              {/* Colorful Floating Particles */}
              <div className="absolute top-8 right-12 w-3 h-3 bg-orange-400 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-ping transition-opacity duration-500"></div>
              <div className="absolute top-16 right-20 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-600" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute bottom-12 left-16 w-3 h-3 bg-violet-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-700" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute bottom-20 left-28 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-50 group-hover:animate-ping transition-opacity duration-800" style={{animationDelay: '0.5s'}}></div>
              
              {/* Colorful Category Index Badge */}
              <div className={`absolute top-6 right-6 w-12 h-12 bg-gradient-to-br ${cardColor.badge} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500 ring-2 ring-white/50`}>
                {index + 1}
              </div>

              <div className="relative z-10">
                <CategoryWiseProductDisplay
                  id={c?._id}
                  name={c?.name}
                />
              </div>
            </div>
          )})
        }
      </div>
    </div>

    {/* Farmer CTA Section */}
    <div className="py-16 px-4 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-6">
            Are You a Farmer? 👨‍🌾
          </h2>
          <p className="text-green-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers selling directly to buyers. No commission, instant payments, and complete control over your produce.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auction/farmer-dashboard" className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center">
              🌾 Register as Farmer
            </Link>
            <button className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white font-bold rounded-full transition-all duration-300 border border-white/50">
              📞 Contact Support
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-white font-semibold">Zero Commission</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold">Instant Payments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-white font-semibold">Easy Dashboard</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚚</div>
              <div className="text-white font-semibold">Logistics Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* News Section */}
    <div className="py-16 px-3 sm:px-6 md:px-16 bg-gradient-to-b from-emerald-50 to-white" id="news">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          Stay Updated
        </span>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-900 tracking-wide mb-4">
          📰 Agricultural News & Updates
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Latest news, market prices, and farming tips from across the country
        </p>
      </div>
      
      <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-8 border border-green-100">
        <NewsSlider/>
      </div>
    </div>

  </section>
  )
}

export default Home
