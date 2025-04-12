import mongoose from 'mongoose'

export const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            price: Number,
            category: String,
            subcategory: String
        }
    ],
    status: {
        type: String,
        default: 'Food Processing'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now()
    }
},{timestamps: true})

export const Order = mongoose.model('Order', orderSchema)