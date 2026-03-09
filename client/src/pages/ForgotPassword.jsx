import React, { useState } from 'react'
import { FaEnvelope } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { IoMailOpenOutline } from "react-icons/io5";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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

        try {
            setIsLoading(true)
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
            }

        } catch (error) {
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
            <div className="absolute top-20 left-10 text-green-300 text-4xl animate-bounce hidden md:block" style={{ animationDuration: '3s' }}>🔑</div>
            <div className="absolute top-40 right-20 text-emerald-300 text-3xl animate-bounce hidden md:block" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>📧</div>
            <div className="absolute bottom-20 left-20 text-teal-300 text-3xl animate-bounce hidden md:block" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>🔐</div>
            <div className="absolute bottom-40 right-10 text-green-300 text-4xl animate-bounce hidden md:block" style={{ animationDuration: '3.2s', animationDelay: '0.3s' }}>✉️</div>

            <div className='w-full max-w-md relative z-10'>
                {/* Main Card */}
                <div className='bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 transform hover:scale-[1.01] transition-all duration-500'>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-6 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-10 w-16 h-16 bg-white/10 rounded-full translate-y-1/2"></div>
                        
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                <IoMailOpenOutline className="text-white text-3xl" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-2">
                                Forgot Password?
                                <HiSparkles className="text-yellow-200 animate-pulse" />
                            </h1>
                            <p className="text-orange-100 text-sm mt-1">No worries, we'll send you reset instructions</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form className='p-6 md:p-8 space-y-5' onSubmit={handleSubmit}>
                        
                        {/* Info Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <div>
                                <p className="text-sm text-amber-800">
                                    Enter your registered email address and we'll send you an OTP to reset your password.
                                </p>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className='group'>
                            <label htmlFor='email' className='text-sm font-semibold text-gray-700 mb-1 block'>Email Address</label>
                            <div className='relative'>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type='email'
                                    id='email'
                                    autoFocus
                                    className='w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-orange-400 focus:bg-white transition-all duration-300'
                                    name='email'
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder='Enter your registered email'
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            disabled={!valideValue || isLoading} 
                            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2
                                ${valideValue && !isLoading
                                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:shadow-orange-300/50 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]" 
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    📨 Send OTP
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>

                        {/* Back to Login Link */}
                        <p className='text-center text-gray-600'>
                            Remember your password?{' '}
                            <Link to="/login" className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-teal-500 transition-all duration-300'>
                                Sign In
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="text-center text-gray-500 text-xs mt-6">
                    Check your spam folder if you don't receive the email 📬
                </p>
            </div>
        </section>
    )
}

export default ForgotPassword


