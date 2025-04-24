const allowedOrigins = [
  "http://localhost:5173",    
  "https://frontend.com"    
  ];
  
  export const corsOptions = {
    origin: function (origin, callback) {
      // Allow the request from origins in the allowedOrigins array
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,  // Allow cookies and authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
  };
  