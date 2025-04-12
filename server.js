import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import router from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import 'dotenv/config'
import cartRouter from './routes/cartRoute.js'
import Razorpay from 'razorpay'
import 'dotenv/config'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import restaurantRouter from './routes/restaurantRoute.js'

const app = express()
const port = 4000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))

connectDB()

app.use('/api/food', router)
app.use('/uploads', express.static('uploads'))
app.use('/api/user', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/payment', productRouter)
app.use('/api/order', orderRouter)
app.use('/api/restaurant', restaurantRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`)
})