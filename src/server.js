import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import { connectDB } from './config/db.js';
import restaurantRouter from './routes/restaurantRoute.js';

//app config
const app= express()
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());

//db connection
connectDB();

//api endpoints
app.use("/api/restaurant",restaurantRouter)
app.use('/uploads', express.static('uploads'));



app.get("/",(req,res)=>{
    res.send("API Working")

})
app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`)
})