import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Failed:", error);
        process.exit(1); 
    }
};