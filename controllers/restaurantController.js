import restaurantModel from '../models/restaurantModel.js'
/*import fs from 'fs'*/

const addRestaurant = async (req, res) => {
    try {
        /*if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }
        let image_filename = req?.file?.filename || ""*/
        const restaurant = new restaurantModel({
            name: req.body.name,
            category: req.body.category,
            subcategory: req.body.subcategory,
            price: req.body.price,
            /*image: `/uploads/${image_filename}`*/
        })
        await restaurant.save()
        res.json({
            success: true,
            message: "Food Added"
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Error",
            error: error.message
        })
    }
}

const getRestaurantList = async (req, res) => {
    try{
        const restaurant = await restaurantModel.find()
        res.json({
            success: true,
            data: restaurant
        })
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error",
            error: error.message
        })
    }
}

const deleteRestaurant = async (req, res) => {
    try{
        const restaurant = await restaurantModel.findByIdAndDelete(req.params.id)
        if(!restaurant){
            return res.json({
                success: false,
                message: "Food item not found"
            })
        }
        /*if(restaurant.image){
            const imagePath = `uploads/${restaurant.image}`
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            }
        }*/
        res.json({
            success: true,
            message: "Food item deleted successfully"
        })
    }
    catch(error){
        res.json({
            success: false,
            message: "Error"
        })
    }
}

const updateRestaurant = async (req, res) => {
    const { id } = req.params
    const { name, category, price, subcategory } = req.body
    /*let imagePath = req.file ? `/uploads/${req.file.filename}` : null*/
    try{
        const restaurant = await restaurantModel.findById(id)
        if(!restaurant){
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            })
        }
        restaurant.name = name || restaurant.name
        restaurant.category = category || restaurant.category
        restaurant.subcategory = subcategory || restaurant.subcategory
        restaurant.price = price || restaurant.price
        /*if(imagePath){
            restaurant.image = imagePath
        }*/
        await restaurant.save()
        res.status(200).json({
            success: true,
            message: 'Food item updated successfully', 
            data: restaurant
        })
    }
    catch(error){
        console.log(error)
    }
}

export { addRestaurant, getRestaurantList, deleteRestaurant, updateRestaurant }