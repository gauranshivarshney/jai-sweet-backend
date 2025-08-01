import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import validator from "validator"

const loginUser = async (req, res) => {
    const {email, password} = req.body
    try{
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({
                success: false,
                message: "User doesn't exist"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const token = createToken(user._id)
        res.json({
            success: true, 
            token,
            userId: user._id
        })
    }
    catch(error){
        console.log(error)
    }
}

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

const registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({
                success: false,
                message: "User already exists"
            })
        }
        if(!validator.isEmail(email)){
            return res.json({
                success: false,
                message: "Please enter a valid email"
            })
        }
        if(password.length < 8){
            return res.json({
                success: false,
                message: "Please enter a strong password"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({
            success: true,
            token,
            userId: user._id
        })
    }
    catch(error){
        console.log(error)
    }
}

export {loginUser, registerUser}