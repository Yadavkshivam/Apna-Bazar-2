import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import Search from './Search'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import { TiWeatherDownpour } from "react-icons/ti";
import { IoLocationSharp, IoCall } from "react-icons/io5";
import { FaLeaf, FaShippingFast, FaHeadset } from "react-icons/fa";
import { GiWheat, GiFarmer } from "react-icons/gi";
import { MdLocalOffer, MdVerified } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleCloseUserMenu = () => {
        setOpenUserMenu(false)
    }

    const handleMobileUser = () => {
        if (!user._id) {
            navigate("/login")
            return
        }
        navigate("/user")
    }

    const getUserInitial = () => {
        if (user?.name) {
            return user.name.charAt(0).toUpperCase()
        }
        return 'U'
    }

    const getUserFirstName = () => {
        if (user?.name) {
            return user.name.split(' ')[0]
        }
        return 'User'
    }

    return (
        <React.Fragment>
            {/* Top Info Bar - Desktop */}
            <div className="hidden lg:block bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white py-2 relative overflow-hidden">
                <div className="container mx-auto px-4 flex items-center justify-between relative z-10">
                    {/* Left - Contact */}
                    <div className="flex items-center gap-6">
                        <a href="tel:+919876543210" className="flex items-center gap-2 text-sm hover:text-yellow-300 transition-colors group">
                            <IoCall className="animate-pulse group-hover:animate-bounce" size={16} />
                            <span>+91 98765 43210</span>
                        </a>
                        <div className="flex items-center gap-2 text-sm">
                            <FaHeadset className="animate-bounce" size={16} />
                            <span>24/7 Farmer Support</span>
                        </div>
                    </div>

                    {/* Center - Info */}
                    <div className="flex-1 mx-8 overflow-hidden">
                        <div className="flex items-center justify-center gap-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 animate-pulse">
                                <MdLocalOffer className="text-yellow-300" />
                                <span className="text-sm font-medium">🌾 Farm Fresh</span>
                            </div>
                            <span className="text-white/50">|</span>
                            <div className="flex items-center gap-2">
                                <HiSparkles className="text-yellow-300 animate-pulse" />
                                <span className="text-sm font-medium">🚜 Direct Farmer Connect</span>
                            </div>
                            <span className="text-white/50">|</span>
                            <div className="flex items-center gap-2">
                                <MdVerified className="text-yellow-300 animate-bounce" />
                                <span className="text-sm font-medium">✨ Live Bidding!</span>
                            </div>
                        </div>
                    </div>

                    {/* Right - Quick Links */}
                    <div className="flex items-center gap-3">
                        <a 
                            href="https://weather-forecast-63d2.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-all hover:scale-105"
                        >
                            <TiWeatherDownpour className="text-blue-300 animate-pulse" size={18} />
                            <span>Weather</span>
                        </a>
                        <a 
                            href="https://realtimetracker-8x7r.onrender.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-all hover:scale-105"
                        >
                            <IoLocationSharp className="text-red-300 animate-bounce" size={16} />
                            <span>Track</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`h-24 lg:h-20 sticky top-0 z-40 flex flex-col justify-center gap-1 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-green-100/50 border-b border-green-100' : 'bg-gradient-to-r from-green-50 via-white to-emerald-50'}`}>
                {/* Decorative Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="hidden lg:block absolute top-1/2 left-8 -translate-y-1/2 text-green-400/30 animate-bounce">
                        <FaLeaf size={24} />
                    </div>
                    <div className="hidden lg:block absolute top-1/2 right-8 -translate-y-1/2 text-amber-400/30 animate-bounce">
                        <GiWheat size={28} />
                    </div>
                </div>

                {!(isSearchPage && isMobile) && (
                    <div className="container mx-auto flex items-center px-4 justify-between relative z-10">
                        {/* Logo */}
                        <div className="h-20 group">
                            <Link to="/" className="h-full flex justify-center items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 blur-xl rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500 scale-150"></div>
                                    <img
                                        src={logo}
                                        width={120}
                                        height={5}
                                        alt="logo"
                                        className="hidden lg:block transition-all duration-300 group-hover:scale-110 relative z-10"
                                    />
                                    <img
                                        src={logo}
                                        width={140}
                                        height={20}
                                        alt="logo"
                                        className="lg:hidden relative z-10"
                                    />
                                </div>
                                <div className="hidden xl:flex flex-col">
                                    <span className="text-xs text-gray-500 font-medium">Fresh from</span>
                                    <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Indian Farms</span>
                                </div>
                            </Link>
                        </div>

                        {/* Search - Desktop */}
                        <div className="hidden lg:block flex-1 max-w-2xl mx-8">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 group-focus-within:opacity-40 transition-all duration-500"></div>
                                <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-green-200 transition-all duration-300">
                                    <Search />
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Live Auctions Button */}
                            <Link 
                                to="/auction" 
                                className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                                <span className="relative">Live Auctions</span>
                                <GiFarmer className="relative animate-bounce" size={18} />
                            </Link>

                            {/* Free Delivery Badge */}
                            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                                <FaShippingFast className="text-green-600 animate-pulse" size={18} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-green-700">Free Delivery</span>
                                    <span className="text-[10px] text-gray-500">Orders ₹500+</span>
                                </div>
                            </div>
                        </div>

                        {/* User Section */}
                        <div className="flex items-center gap-3">
                            {/* Mobile User Icon */}
                            <button 
                                className="lg:hidden relative p-2.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 active:scale-95" 
                                onClick={handleMobileUser}
                            >
                                <FaRegCircleUser size={24} />
                                {user?._id && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                            </button>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-4">
                                {user?._id ? (
                                    <div className="relative">
                                        <div 
                                            onClick={() => setOpenUserMenu(prev => !prev)} 
                                            className="flex select-none items-center gap-2 cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all duration-300 hover:shadow-md group"
                                        >
                                            <div className="relative">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                                    {getUserInitial()}
                                                </div>
                                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500">Welcome!</span>
                                                <span className="text-sm font-semibold text-gray-700 truncate max-w-[80px]">{getUserFirstName()}</span>
                                            </div>
                                            <div className={`transition-transform duration-300 ${openUserMenu ? 'rotate-180' : ''}`}>
                                                <GoTriangleDown size={18} className="text-gray-400" />
                                            </div>
                                        </div>
                                        
                                        {/* Dropdown */}
                                        {openUserMenu && (
                                            <div className="absolute right-0 top-16 z-50">
                                                <div className="bg-white rounded-2xl p-4 min-w-60 shadow-2xl shadow-green-100/50 border border-green-100">
                                                    <UserMenu close={handleCloseUserMenu} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={redirectToLoginPage} 
                                        className="relative px-6 py-2.5 rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 text-white font-semibold shadow-lg shadow-green-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                        <span className="relative">Login / Sign Up</span>
                                    </button>
                                )}

                                {/* Cart Button */}
                                <button 
                                    onClick={() => setOpenCartSection(true)} 
                                    className="relative flex items-center gap-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 px-5 py-2.5 rounded-full text-white shadow-lg shadow-green-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <div className="relative">
                                        <BsCart4 size={22} className="relative z-10 group-hover:animate-bounce" />
                                        {cartItem[0] && (
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold animate-pulse shadow-md">
                                                {totalQty > 9 ? '9+' : totalQty}
                                            </span>
                                        )}
                                    </div>
                                    <div className="font-medium text-sm relative z-10">
                                        {cartItem[0] ? (
                                            <div className="text-left">
                                                <p className="text-[10px] opacity-80">{totalQty} Items</p>
                                                <p className="font-bold">{DisplayPriceInRupees(totalPrice)}</p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <span>My Cart</span>
                                                <HiSparkles className="animate-pulse" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Search */}
                <div className="container mx-auto px-4 lg:hidden">
                    <Search />
                </div>

                {/* Cart Drawer */}
                {openCartSection && (
                    <DisplayCartItem close={() => setOpenCartSection(false)} />
                )}
            </header>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-2xl">
                <div className="flex items-center justify-around py-2 px-4 pb-2">
                    {/* Home */}
                    <Link to="/" className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <FaLeaf size={20} />
                        <span className="text-[10px] font-medium">Home</span>
                    </Link>

                    {/* Live Auction */}
                    <Link to="/auction" className="relative flex flex-col items-center gap-0.5 p-2 text-orange-500">
                        <div className="relative">
                            <GiFarmer size={22} className="animate-bounce" />
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </div>
                        <span className="text-[10px] font-bold">Live Bid</span>
                    </Link>

                    {/* Cart - Center */}
                    <button 
                        onClick={() => setOpenCartSection(true)}
                        className="relative -mt-6 flex flex-col items-center"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-300/50 border-4 border-white">
                            <BsCart4 size={24} className="text-white" />
                            {cartItem[0] && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold animate-pulse">
                                    {totalQty}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold text-green-600 mt-1">Cart</span>
                    </button>

                    {/* Weather */}
                    <a 
                        href="https://weather-forecast-63d2.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-0.5 p-2 text-blue-500"
                    >
                        <TiWeatherDownpour size={22} className="animate-pulse" />
                        <span className="text-[10px] font-medium">Weather</span>
                    </a>

                    {/* Account */}
                    <button onClick={handleMobileUser} className="flex flex-col items-center gap-0.5 p-2 text-gray-600 hover:text-green-600 transition-colors">
                        <FaRegCircleUser size={20} />
                        <span className="text-[10px] font-medium">Account</span>
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Header