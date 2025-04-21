import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({

    name:{ type:String,required:true},
    address: {type:String,required:true},
    isOpen: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],


})

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant",restaurantSchema)

export default restaurantModel;