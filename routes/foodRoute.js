import express from 'express'
import { addFood, deleteFood, getFoodList, updateFood } from '../controllers/foodController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
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

router.post('/add', upload.single('image'), addFood)
router.put('/update/:id', upload.single('image'), updateFood)
router.get('/list', getFoodList)
router.delete('/delete/:id', deleteFood)

export default router