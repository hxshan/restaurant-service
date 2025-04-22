import express from 'express'
import multer from 'multer'
import { addMenuItem, addRestaurant, deleteMenuItem, getMenuItem, getRestaurantById, getRestaurants, getUnverifiedRestaurants, updateAvailability, updateMenuItem, verifyRestaurant } from '../controllers/restaurantController.js';
import { mockAuth } from '../middleware/mockAuth.js';


const restaurantRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=> {
      return cb(null, `${Date.now()}${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })

  restaurantRouter.post('/add',mockAuth,upload.single("image"),addRestaurant);
  restaurantRouter.get('/get/:id', getRestaurantById);
  restaurantRouter.get('/get',getRestaurants);
  restaurantRouter.get('/admin/unverified',getUnverifiedRestaurants);
  restaurantRouter.put('/admin/verify/:id',verifyRestaurant);
  restaurantRouter.put('/:id/availability',mockAuth,updateAvailability);
  restaurantRouter.post('/:id/menu',mockAuth,upload.single("image"),addMenuItem);
  router.get('/menu-item/:menuItemId',getMenuItem);
  restaurantRouter.put('/update/:menuItemId',upload.single("image"),updateMenuItem);
  restaurantRouter.delete('/delete-menu/:menuItemId',deleteMenuItem);

  export default restaurantRouter