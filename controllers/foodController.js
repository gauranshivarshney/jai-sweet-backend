import foodModel from "../models/foodModel.js";
import fs from 'fs'

const addFood = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Image is required"
            })
        }
        let image_filename = req?.file?.filename || ""
        let rateArray = []
        if (req.body.rate) {
            try {
                if (typeof req.body.rate === "string") {
                    rateArray = JSON.parse(req.body.rate);
                }
                else if (Array.isArray(req.body.rate)) {
                    rateArray = req.body.rate;
                }
            }
            catch (error) {
                console.log(error)
            }
        }
        const food = new foodModel({
            name: req.body.name,
            category: req.body.category,
            image: `/uploads/${image_filename}`,
            rate: rateArray
        })
        await food.save()
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

const getFoodList = async (req, res) => {
    try{
        const foods = await foodModel.find()
        res.json({
            success: true,
            data: foods
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

const deleteFood = async (req, res) => {
    try{
        const food = await foodModel.findByIdAndDelete(req.params.id)
        if(!food){
            return res.json({
                success: false,
                message: "Food item not found"
            })
        }
        if(food.image){
            const imagePath = `uploads/${food.image}`
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            }
        }
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

const updateFood = async (req, res) => {
    const { id } = req.params
    const { name, category, rate } = req.body
    let imagePath = req.file ? `/uploads/${req.file.filename}` : null
    try{
        const food = await foodModel.findById(id)
        if(!food){
            return res.status(404).json({
                success: false,
                message: 'Food item not found'
            })
        }
        food.name = name || food.name
        food.category = category || food.category
        food.rate = rate ? JSON.parse(rate): food.rate
        if(imagePath){
            food.image = imagePath
        }
        await food.save()
        res.status(200).json({
            success: true,
            message: 'Food item updated successfully', data: food
        })
    }
    catch(error){
        console.log(error)
    }
}

export { addFood, getFoodList, deleteFood, updateFood }