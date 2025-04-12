import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String
    },
    price: {
        type: String,
        required: true
    },
    /*image: {
        type: String,
        required: true
    }*/
})

const restaurantModel = mongoose.models.restaurant || mongoose.model("restaurant", restaurantSchema)

export default restaurantModel