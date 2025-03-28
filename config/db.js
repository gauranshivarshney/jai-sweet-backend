import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://gauranshivarshney:oLRpXExfKdI9T9OI@cluster0.22bp4.mongodb.net/jai-sweet').then(() => console.log("DB Connected"))
}