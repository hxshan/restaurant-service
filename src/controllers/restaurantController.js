import restaurantModel from "../models/restaurantModel.js"
import menuItemModel from "../models/menuItemModel.js"
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url';

export const  addRestaurant = async (req,res) => {
  
    try {
      console.log('Incoming request body:', req.body);
        const { name, address, isOpen,rating,phoneNumbers, longitude, latitude } = req.body;
         const image = req.file.filename;

        if (!name || !address,!phoneNumbers || !phoneNumbers.length) {
          return res.status(400).json({ message: "Name and Address are required" });
        }
        if (longitude && isNaN(longitude)) {
          return res.status(400).json({ message: "Invalid longitude" });
        }
        if (latitude && isNaN(latitude)) {
          return res.status(400).json({ message: "Invalid latitude" });
        }
        
        //const ownerId = req.user.userId; 
    
        const newRestaurant = new restaurantModel({
          name,
          address,
          isOpen: isOpen ?? true, 
          rating: rating ?? 0,
          menuItems: [],
          image,
          phoneNumbers,
         //ownerId 
    
        });
        if (longitude && latitude) {
          newRestaurant.location = {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          };
        }
       
    
        const savedRestaurant = await newRestaurant.save();
  
        res.json({
          success:true,
          message: `Restaurant '${savedRestaurant.name}' added successfully`,
          restaurant: savedRestaurant
        });
    
      } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false, message: "Bad Request" });

      }

}

export const getRestaurantById = async (req, res) => {
    try {
     
      const restaurant = await restaurantModel.findById(req.params.id).populate('menuItems');
      if (!restaurant) return res.status(404).json({ message: 'restaurant not found' });
      res.status(200).json(restaurant);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

export const  getRestaurants = async (req,res) => {
    try {
        const restaurants = await restaurantModel
          .find()
          .populate('menuItems'); 
    
        res.status(200).json(restaurants);
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
      }

}

export const updateAvailability = async (req, res) => {
    try {
      const { isOpen } = req.body;
      const restaurant = await restaurantModel.findByIdAndUpdate(
        req.params.id,
        { isOpen },
        { new: true }
      );
      if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  
      res.status(200).json({
        message: `Restaurant '${restaurant.name}' is now ${isOpen ? 'Open' : 'Closed'}`,
        restaurant
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const  addMenuItem = async (req,res) => {
    try {
        const { name, description, price, category,size } = req.body;
        const image = req.file.filename;
    
        const newItem = new menuItemModel({
          name,
          description,
          price,
          category,
          image,
          size
        });
    
        const savedItem = await newItem.save();

        const restaurant = await restaurantModel.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
          }
        restaurant.menuItems.push(savedItem._id);

        await restaurant.save();

    //     const updatedRestaurant = await restaurantModel
    //   .findById(req.params.id)
    //   .populate('menuItems');
    
        res.json({
            success:true,
            message: `Menu item '${name}' added successfully to restaurant '${restaurant.name}'`,
            menuItem: savedItem,
            restaurantId: restaurant._id
            // restaurant: updatedRestaurant
          });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

}
export const getMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;
    const menuItem = await menuItemModel.findById(menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({
      success: true,
      menuItem
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const  deleteMenuItem  = async (req,res) => {
    try {
        const menuItem = await menuItemModel.findById(req.params.menuItemId);
        if (!menuItem) {
          return res.status(404).json({ message: 'Menu item not found' });
        }
    
        const imagePath = path.join('uploads', menuItem.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("not found", err.message);
          }
        });

        await menuItemModel.findByIdAndDelete(req.params.menuItemId);
       
        await restaurantModel.updateMany(
          { menuItems: req.params.menuItemId },
          { $pull: { menuItems: req.params.menuItemId } }
        );
    
        res.status(200).json({ message: 'Menu deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}



const __dirname = path.dirname(fileURLToPath(import.meta.url));



export const updateMenuItem = async (req, res) => {
  try {
    const updateData = { 
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      size: req.body.size
    };

    if (req.file) {
      updateData.image = req.file.filename;
      
      if (req.body.oldImage) {
        const oldImagePath = path.join(__dirname, '../uploads', req.body.oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedItem = await menuItemModel.findByIdAndUpdate(
      req.params.menuItemId,
      updateData,
      { new: true, runValidators: true }
    );

   
    const restaurant = await restaurantModel.findOne({ menuItems: updatedItem._id });

    res.status(200).json({
      success: true,
      message: "Menu Updated Successfully",
      updatedItem,
      restaurantId: restaurant._id 
    });
    
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message
    });
  }
};