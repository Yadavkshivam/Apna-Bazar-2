import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        role:"",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        if(data.password !== data.confirmPassword){
            toast.error(
                "password and confirm password must be same"
            )
            return
        }

            try {
                setIsLoading(true)
                const response = await Axios({
                    ...SummaryApi.register,
                    data: data
                });

                console.log("Abhi hm check kar rhe ki axios post ho rha hai ki nhi ", data );
                console.log(SummaryApi.register)
                
                if(response.data.error){
                    toast.error(response.data.message)
                }

                if(response.data.success){
                    
                    toast.success(response.data.message)
                    setData({
                        name : "",
                        email : "",
                        role:"",
                        password : "",
                        confirmPassword : ""
                    })
                    navigate("/login")
                }

            } catch (error) {
                console.log("abhi hm register ka data dekh rhe ",error);
                AxiosToastError(error)
            } finally {
                setIsLoading(false)
            }
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-teal-300/30 to-green-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Floating Icons */}
            <div className="absolute top-20 left-10 text-green-300 text-4xl animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>🌾</div>
            <div className="absolute top-40 right-20 text-emerald-300 text-3xl animate-bounce hidden md:block" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🥬</div>
            <div className="absolute bottom-20 left-20 text-teal-300 text-3xl animate-bounce hidden md:block" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>🍎</div>
            <div className="absolute bottom-40 right-10 text-green-300 text-4xl animate-bounce hidden md:block" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>🌽</div>
            <div className="absolute bottom-20 right-10 text-green-300 text-4xl animate-bounce hidden md:block" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>👨🏻‍🌾</div>


            <div className='w-full max-w-md relative z-10'>
                {/* Main Card */}
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 transform hover:scale-[1.01] transition-all duration-500'>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-10 w-16 h-16 bg-white/10 rounded-full translate-y-1/2"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <span className="text-3xl">🌿</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                                Join Apna Bazar
                                <HiSparkles className="text-yellow-300 animate-pulse" />
                            </h1>
                            <p className="text-green-100 text-sm mt-1">Start your fresh journey today</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className='p-6 md:p-8 space-y-4' onSubmit={handleSubmit}>
                        
                        {/* Name Field */}
                        <div className='group'>
                            <label htmlFor='name' className='text-sm font-semibold text-gray-700 mb-1 block'>Full Name</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <FaUser />
                                </div>
                                <input
                                    type='text'
                                    id='name'
                                    autoFocus
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                                    name='name'
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder='Enter your full name'
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className='group'>
                            <label htmlFor='email' className='text-sm font-semibold text-gray-700 mb-1 block'>Email Address</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email'
                                />
                            </div>
                        </div>

                        {/* Role Field */}
                        <div className='group'>
                            <label htmlFor='role' className='text-sm font-semibold text-gray-700 mb-1 block'>Your Role</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <FaUserTag />
                                </div>
                                <input
                                    type='text'
                                    id='role'
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                                    name='role'               
                                    value={data.role}
                                    onChange={handleChange}
                                    placeholder='FARMER / USER / EXPERT '
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className='group'>
                            <label htmlFor='password' className='text-sm font-semibold text-gray-700 mb-1 block'>Password</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id='password'
                                    className='w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                                    name='password'
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder='Create a strong password'
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)} 
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors p-1'
                                >
                                    {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className='group'>
                            <label htmlFor='confirmPassword' className='text-sm font-semibold text-gray-700 mb-1 block'>Confirm Password</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors">
                                    <FaLock />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id='confirmPassword'
                                    className='w-full pl-10 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-400 focus:bg-white transition-all duration-300'
                                    name='confirmPassword'
                                    value={data.confirmPassword}
                                    onChange={handleChange}
                                    placeholder='Confirm your password'
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)} 
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition-colors p-1'
                                >
                                    {showConfirmPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={!valideValue || isLoading} 
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mt-6
                                ${valideValue && !isLoading
                                    ? "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:shadow-green-300/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]" 
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    🚀 Create Account
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        {/* Login Link */}
                        <p className='text-center text-gray-600'>
                            Already have an account?{' '}
                            <Link to="/login" className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-teal-500 transition-all duration-300'>
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    By registering, you agree to our{' '}
                    <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
                </p>
            </div>
        </section>
    )
}

export default Register
