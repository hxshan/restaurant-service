import jwt from 'jsonwebtoken'; 


// Middleware to verify JWT token and check user role
export const protectRestaurant = (role) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if the user has the required role
      if (role && !req.user.roles.includes(role)) {
        return res.status(403).json({ message: `Access denied. You need ${role} role.` });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  };
};


