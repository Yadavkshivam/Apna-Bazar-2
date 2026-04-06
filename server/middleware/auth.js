import jwt from 'jsonwebtoken'

const auth = async (request, response, next) => {
  try {
    const token = request.cookies.accessToken || request.headers?.authorization?.split(" ")[1];

    console.log('🔐 auth middleware — token exists:', !!token);

    if (!token) {
      return response.status(401).json({ message: 'Token missing. Please login.', error: true, success: false });
    }

    const decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    console.log('🔐 decoded token:', decoded);  // ← check what field has the userId

    if (!decoded) {
      return response.status(401).json({ message: 'Invalid token', error: true, success: false });
    }

    // ← Check what your token actually stores — could be 'id' or '_id' or 'userId'
    request.userId = decoded.id || decoded._id || decoded.userId;
    console.log('🔐 request.userId set to:', request.userId);

    next();
  } catch (error) {
    console.error('❌ auth middleware error:', error.message);
    return response.status(401).json({ message: error.message, error: true, success: false });
  }
};

export default auth