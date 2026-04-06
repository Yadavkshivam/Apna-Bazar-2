// Remove trailing slash from API URL
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080"
export const baseURL = apiUrl.replace(/\/+$/, '')

const SummaryApi = {
    register: {
        url: '/api/user/register',
        method: 'post'
    },
    login: {
        url: "/api/user/login",
        method: 'post'
    },
    forgot_password: {
        url: "/api/user/forgot-password",
        method: 'put'
    },
    forgot_password_otp_verification: {
        url: "/api/user/verify-forgot-password-otp",
        method: 'put'
    },
    resetPassword: {
        url: "/api/user/reset-password",
        method: 'put'
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: 'post'
    },
    userDetails: {
        url: "/api/user/user-details",
        method: 'get'
    },
    logout: {
        url: '/api/user/logout',
        method: 'get'
    },
    uploadAvatar: {
        url: "/api/user/upload-avatar",
        method: 'put'
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: 'put'
    },
    addCategory: {
        url: '/api/category/add-category',
        method: 'post'
    },
    uploadImage: {
        url: '/api/file/upload',
        method: 'post'
    },
    getCategory: {
        url: '/api/category/get',
        method: 'get'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'put'
    },
    deleteCategory: {
        url: '/api/category/delete',
        method: 'delete'
    },
    createSubCategory: {
        url: '/api/subcategory/create',
        method: 'post'
    },
    getSubCategory: {
        url: '/api/subcategory/get',
        method: 'post'
    },
    updateSubCategory: {
        url: '/api/subcategory/update',
        method: 'put'
    },
    deleteSubCategory: {
        url: '/api/subcategory/delete',
        method: 'delete'
    },
    createProduct: {
        url: '/api/product/create',
        method: 'post'
    },
    getProduct: {
        url: '/api/product/get',
        method: 'post'
    },
    getProductByCategory: {
        url: '/api/product/get-product-by-category',
        method: 'post'
    },
    getProductByCategoryAndSubCategory: {
        url: '/api/product/get-pruduct-by-category-and-subcategory',
        method: 'post'
    },
    getProductDetails: {
        url: '/api/product/get-product-details',
        method: 'post'
    },
    updateProductDetails: {
        url: '/api/product/update-product-details',
        method: 'put'
    },
    deleteProduct: {
        url: "/api/product/delete-product",
        method: 'delete'
    },
    searchProduct: {
        url: '/api/product/search-product',
        method: 'post'
    },
    addTocart: {
        url: '/api/cart/create',
        method: 'post'
    },
    getCartItem: {
        url: '/api/cart/get',
        method: 'get'
    },
    updateCartItemQty: {
        url: '/api/cart/update-qty',
        method: 'put'
    },
    deleteCartItem: {
        url: '/api/cart/delete-cart-item',
        method: 'delete'
    },
    createAddress: {
        url: '/api/address/create',
        method: 'post'
    },
    getAddress: {
        url: '/api/address/get',
        method: 'get'
    },
    updateAddress: {
        url: '/api/address/update',
        method: 'put'
    },
    disableAddress: {
        url: '/api/address/disable',
        method: 'delete'
    },
    CashOnDeliveryOrder: {
        url: '/api/order/cash-on-delivery',
        method: 'post'
    },
    payment_url: {
        url: '/api/order/checkout',
        method: 'post'
    },
    getOrderItems: {
        url: '/api/order/order-list',
        method: 'get'
    },
    // Expert Consultation APIs
    getExperts: {
        url: '/api/expert/list',
        method: 'get'
    },
    getExpertById: {
        url: '/api/expert/details/:id',
        method: 'get'
    },
    getAvailableSlots: {
        url: '/api/expert/available-slots',
        method: 'get'
    },
    createBooking: {
        url: '/api/expert/book',
        method: 'post'
    },
    getMyBookings: {
        url: '/api/expert/my-bookings',
        method: 'get'
    },
    getExpertDashboard: {
        url: '/api/expert/dashboard',
        method: 'get'
    },
    getExpertBookings: {
        url: '/api/expert/bookings',
        method: 'get'
    },
    acceptBooking: {
        url: '/api/expert/booking/:bookingId/accept',
        method: 'put'
    },
    rejectBooking: {
        url: '/api/expert/booking/:bookingId/reject',
        method: 'put'
    },
    registerAsExpert: {
        url: '/api/expert/register',
        method: 'post'
    },
    updateAvailability: {
        url: '/api/expert/availability',
        method: 'put'
    },
    seedDemoExperts: {
        url: '/api/expert/seed-demo',
        method: 'post'
    },

    // ─── Session Booking ─────────────────────────────────────────────────────
    createBooking: {
        url: '/api/session-booking/create',
        method: 'post'
    },
    getUserBookings: {
        url: '/api/session-booking/my-bookings',
        method: 'get'
    },
    cancelBooking: {
        url: '/api/session-booking/cancel',
        method: 'put'
    },
    getExpertBookings: {
        url: '/api/session-booking/expert/all',
        method: 'get'
    },
    getExpertStats: {
        url: '/api/session-booking/expert/stats',
        method: 'get'
    },
    approveBooking: {
        url: '/api/session-booking/expert/approve',
        method: 'put'
    },
    rejectBooking: {
        url: '/api/session-booking/expert/reject',
        method: 'put'
    },
    markCompleted: {
        url: '/api/session-booking/expert/complete',
        method: 'put'
    },
}

export default SummaryApi