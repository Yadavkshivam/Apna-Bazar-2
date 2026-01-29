import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'

const OrderSuccess = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  
  const orderDetails = {
    orderId: 'APB-2026-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    productName: 'Premium Wheat',
    quantity: '50 Quintals',
    pricePerUnit: 2450,
    totalAmount: 122500,
    farmerName: 'Gurpreet Singh',
    farmerLocation: 'Punjab',
    buyerName: 'Sharma Traders',
    estimatedDelivery: '3-5 business days',
    paymentStatus: 'Pending',
  }

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...")
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
      const stripePromise = await loadStripe(stripePublicKey)
      
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: [{
            productId: {
              _id: "auction_order",
              name: "Premium Wheat - 50 Quintals",
              image: [],
              price: 122500,
              discount: 0
            },
            quantity: 1,
          }],
          subTotalAmt: 122500,
          totalAmt: 122500,
        }
      })

      const { data: responseData } = response
      stripePromise.redirectToCheckout({ sessionId: responseData.id })
      
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-3xl font-extrabold mb-2">Order Confirmed!</h1>
            <p className="text-green-100">Your bid has been accepted successfully</p>
          </div>

          {/* Order Details */}
          <div className="p-6 space-y-4">
            {/* Order ID */}
            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Order ID</div>
              <div className="text-xl font-bold text-green-700 font-mono">{orderDetails.orderId}</div>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Product</span>
                <span className="font-semibold text-gray-800">{orderDetails.productName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Quantity</span>
                <span className="font-semibold text-gray-800">{orderDetails.quantity}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Price per Quintal</span>
                <span className="font-semibold text-gray-800">₹{orderDetails.pricePerUnit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Seller</span>
                <span className="font-semibold text-gray-800">{orderDetails.farmerName}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-800">📍 {orderDetails.farmerLocation}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Est. Delivery</span>
                <span className="font-semibold text-green-600">{orderDetails.estimatedDelivery}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 flex justify-between items-center text-white">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-extrabold text-2xl">₹{orderDetails.totalAmount.toLocaleString()}</span>
            </div>

            {/* Payment Status */}
            <div className="bg-yellow-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-xl">
                💳
              </div>
              <div>
                <div className="font-semibold text-gray-800">Payment Pending</div>
                <div className="text-sm text-gray-500">Complete payment within 24 hours</div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">📋 Next Steps</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Order confirmation sent to your email
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  Farmer has been notified
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">○</span>
                  Complete payment to finalize order
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400">○</span>
                  Coordinate delivery with seller
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleOnlinePayment} 
                disabled={isProcessing}
                className={`w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-700'}`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>💳 Pay ₹{orderDetails.totalAmount.toLocaleString()} Online</>
                )}
              </button>
 

       
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/auction"
                  className="py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center"
                >
                  More Auctions
                </Link>
                <button className="py-3 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-colors">
                  📞 Contact Seller
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? <a href="#" className="text-green-600 font-semibold hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  )
}

export default OrderSuccess
