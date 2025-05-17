import express from 'express'
import multer from 'multer'
import { addMenuItem, addRestaurant, deleteMenuItem, getMenuItem, getRestaurantById, getRestaurants,updateAvailability, updateMenuItem} from '../controllers/restaurantController.js';


const restaurantRouter = express.Router();

//Image storage engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=> {
      return cb(null, `${Date.now()}${file.originalname}`)
    }
  })
  
  const upload = multer({ storage: storage })

  restaurantRouter.post('/add',upload.single("image"),addRestaurant);
  restaurantRouter.get('/get/:id', getRestaurantById);
  restaurantRouter.get('/get',getRestaurants);
  restaurantRouter.put('/:id/availability',updateAvailability);
  restaurantRouter.post('/:id/menu',upload.single("image"),addMenuItem);
  restaurantRouter.get('/menu-item/:menuItemId',getMenuItem);
  restaurantRouter.put('/update/:menuItemId',upload.single("image"),updateMenuItem);
  restaurantRouter.delete('/delete-menu/:menuItemId',deleteMenuItem);

  export default restaurantRouter