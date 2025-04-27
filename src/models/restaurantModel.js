import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({

    name:{ type:String,required:true},
    address: {type:String,required:true},
    isOpen: { type: Boolean, default: true },
    image: { type: String },
    rating: { type: Number, default: 0 }, 
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],


}, { timestamps: true })

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant",restaurantSchema)

export default restaurantModel;