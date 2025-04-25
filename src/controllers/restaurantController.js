import restaurantModel from "../models/restaurantModel.js"
import menuItemModel from "../models/menuItemModel.js"
import fs from 'fs'
import path from 'path';

export const  addRestaurant = async (req,res) => {
    try {
        const { name, address, isOpen,rating } = req.body;
         const image = req.file.filename;

        if (!name || !address) {
          return res.status(400).json({ message: "Name and Address are required" });
        }
    
        const newRestaurant = new restaurantModel({
          name,
          address,
          isOpen: isOpen ?? true, 
          rating: rating ?? 0,
          menuItems: [],
          image,
    
        });
    
        const savedRestaurant = await newRestaurant.save();
    
        res.json({
          success:true,
          message: `Restaurant '${savedRestaurant.name}' added successfully`,
          restaurant: savedRestaurant
        });
    
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
      }

}

export const getRestaurantById = async (req, res) => {
    try {
      // In your backend route handler
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

// export const verifyRestaurant = async (req, res) => {
//     try {
//       const { verified } = req.body;
  
//       const restaurant = await restaurantModel.findByIdAndUpdate(
//         req.params.id,
//         { verified },
//         { new: true }
//       );
  
//       if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  
//       res.status(200).json({
//         message: `Restaurant ${verified ? 'verified' : 'rejected'} successfully`,
//         restaurant
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };
  

// export const getUnverifiedRestaurants = async (req, res) => {
//     try {
//       const restaurants = await restaurantModel.find({ verified: false });
//       res.status(200).json(restaurants);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };

export const  addMenuItem = async (req,res) => {
    try {
        const { name, description, price, category } = req.body;
        const image = req.file.filename;
    
        const newItem = new menuItemModel({
          name,
          description,
          price,
          category,
          image
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

// export const  updateMenuItem  = async (req,res) => {
//     try {
//         const updatedItem = await menuItemModel.findByIdAndUpdate(
//           req.params.menuItemId,
//           req.body,
//           { new: true }
//         );
//         if (!updatedItem) return res.status(404).json({ error: 'Menu item not found' });
//         res.json({message:"Menu Updated Successfully",updatedItem});
//       } catch (err) {
//         res.status(500).json({ error: err.message });
//       }

// }
export const updateMenuItem = async (req, res) => {
  try {
      
      const updateData = { ...req.body };
      
      
      if (req.file) {
          updateData.image = req.file.filename;
          
          
          if (req.body.oldImage) {
              const fs = require('fs');
              const path = require('path');
              const oldImagePath = path.join('uploads', req.body.oldImage);
              
              if (fs.existsSync(oldImagePath)) {
                  fs.unlink(oldImagePath, (err) => {
                      if (err) console.error('Error deleting old image:', err);
                  });
              }
          }
      }

      const updatedItem = await menuItemModel.findByIdAndUpdate(
          req.params.menuItemId,
          updateData,
          { new: true }
      );

      if (!updatedItem) {
          return res.status(404).json({ error: 'Menu item not found' });
      }

      res.json({
          message: "Menu Updated Successfully",
          updatedItem
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

