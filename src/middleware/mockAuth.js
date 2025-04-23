export const mockAuth = (req, res, next) => {
    req.user = {
      id: 'demo-user-id',
      name: 'Demo Restaurant Owner',
      role: 'restaurant',
    };
    next();
  };
  
  
  