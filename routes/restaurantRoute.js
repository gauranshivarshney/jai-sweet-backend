import express from 'express'
import { addRestaurant, updateRestaurant, getRestaurantList, deleteRestaurant } from '../controllers/restaurantController.js'
/*import multer from 'multer'*/

const router = express.Router()

/*const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads')
    },
    filename: function (req, file, cb){
       cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage:storage
})

router.post('/add', upload.single('image'), addRestaurant)
router.put('/update/:id', upload.single('image'), updateRestaurant)*/

router.post('/add', addRestaurant)
router.put('/update/:id', updateRestaurant)
router.get('/list', getRestaurantList)
router.delete('/delete/:id', deleteRestaurant)

export default router