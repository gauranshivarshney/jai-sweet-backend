import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import Razorpay from 'razorpay'

const productRouter = express.Router()

const razorpay = new Razorpay({
    key_id: 'rzp_test_089xtzoohYrmlL',
    key_secret: 'WDoMvbHsauR91iyGyKh5IMNx'
})

productRouter.post('/create-order', async (req, res) => {
    const {amount, currency, receipt} = req.body
    try{
        const order = await razorpay.orders.create({
            amount: amount,
            currency: currency,
            receipt: receipt
        })
        res.json(order)
    }
    catch(error){
        console.error(error)
    }
})

productRouter.post('/verify', async (req, res) => {
    const {paymentId} = req.body
    res.json({
        success: true,
        paymentId
    })
})

export default productRouter