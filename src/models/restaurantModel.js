import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  isOpen: { type: Boolean, default: true },
  image: { type: String },
  rating: { type: Number, default: 0 },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }],
  
  phoneNumbers: {
    type: [String], 
    validate: {
      validator: function (v) {
        return v.length === 1 || (v.length >= 1 && v.length <= 3); 
      },
      message: 'A restaurant must have exactly 1 or between 1 and 3 phone numbers'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: false
    }

  }

}, { timestamps: true });

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema);

export default restaurantModel;
