import { Order } from '../models/orderModel.js'
import userModel from '../models/userModel.js'
import express from 'express'
import Razorpay from 'razorpay'
import { authMiddleware } from '../middleware/auth.js'
import dotenv from 'dotenv';

dotenv.config();

const orderRouter = express.Router()

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

orderRouter.get('/list', async (req, res) => {
    try{
        const orders = await Order.find({})
        .populate('userId', 'name')
        .select('userId products address phone amount status')
        res.json({
            success: true,
            data: orders
        })
    }
    catch(error){
        console.log(error)
    }
})

orderRouter.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id)
    if(!order){
        res.status(500).json({
            message: 'id not found'
        })
    }
    return res.status(200).send(order)
})

orderRouter.delete('/:id', async (req, res) => {
    const deleteOrder = await Order.findByIdAndDelete(req.params.id)
    if(!deleteOrder){
        res.status(404).json({
            message: 'Order not found',
            success: false
        })
    }
    res.status(200).json({
        success: true,
        message: 'Order deleted'
    })
})

orderRouter.post('/create', async (req, res) => {
    try{
        const {userId, name, phone, address, amount, paymentId, products, status, category, subcategory} = req.body

        if(!products || products.length === 0){
            return res.status(400).json({
                success: false,
                message: 'Product required'
            })
        }

        const productsWithDetails = products.map(product => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            weight: product.weight,
            image: product.image,
            category: product.category,
            subcategory: product.subcategory
        }))

        let order = new Order({
            userId,
            name,
            phone,
            address,
            amount,
            paymentId,
            products: productsWithDetails,
            status: status,
            paymentStatus: 'Completed',
            date: new Date()
        })
        const savedOrder = await order.save()

        await userModel.findByIdAndUpdate(userId, {cartItems: {}})
        
        res.status(201).json(savedOrder)
    }
    catch(error){
        console.log(error)
    }
})

orderRouter.post('/verify', async (req, res) => {
    const {orderId, success} = req.body
    try{
        if(success == 'true'){
            await Order.findByIdAndUpdate(orderId, {payment: true})
            res.json({
                success: true,
                message: 'paid'
            })
        }
        else{
            await Order.findByIdAndUpdate(orderId)
            res.json({
                success: false,
                message: 'Not paid'
            })
        }
    }
    catch(error){
        console.log(error)
    }
})

orderRouter.post('/userOrders', authMiddleware, async (req, res) => {
    try{
        const orders = await Order.find({userId: req.user.id})
        if(!orders){
            return res.status(404).json({
                success: false,
                message: "No order"
            })
        }
        res.json({
            success: true,
            data: orders
        })
    }
    catch(error){
        console.log(error)
    }
})

orderRouter.post('/status', async (req, res) => {
    try{
        await Order.findByIdAndUpdate(req.body.orderId, {status: req.body.status}, {new: true})
        res.json({
            success: true,
            message: "Status updated"
        })
    }
    catch(error){
        console.log(error)
    }
})

export default orderRouter