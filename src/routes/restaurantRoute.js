import express from 'express'
import multer from 'multer'
import { addMenuItem, addRestaurant, deleteMenuItem, getMenuItem, getRestaurantById, getRestaurants,updateAvailability, updateMenuItem} from '../controllers/restaurantController.js';
import { protectRestaurant } from '../middleware/restaurantProtect.js';

const restaurantRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=> {
      return cb(null, `${Date.now()}${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })

  restaurantRouter.post('/add',protectRestaurant('restaurant'),upload.single("image"),addRestaurant);
  restaurantRouter.get('/get/:id', getRestaurantById);
  restaurantRouter.get('/get',getRestaurants);
  //restaurantRouter.get('/admin/unverified',getUnverifiedRestaurants);
  //restaurantRouter.put('/admin/verify/:id',verifyRestaurant);
  restaurantRouter.put('/:id/availability',updateAvailability);
  restaurantRouter.post('/:id/menu',protectRestaurant('restaurant'),upload.single("image"),addMenuItem);
  restaurantRouter.get('/menu-item/:menuItemId',getMenuItem);
  restaurantRouter.put('/update/:menuItemId',protectRestaurant('restaurant'),upload.single("image"),updateMenuItem);
  restaurantRouter.delete('/delete-menu/:menuItemId',protectRestaurant('restaurant'),deleteMenuItem);

  export default restaurantRouter