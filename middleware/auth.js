import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.header("Authorization")
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success: false,
            message: "No token"
        })
    }
    const token = authHeader.split(" ")[1]
    try{
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {id: token_decode.id}
        next()
    }
    catch(error){
        console.log(error)
    }
}