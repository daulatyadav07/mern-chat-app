import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();
export const verifytoken=(req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return(res.status(403).json({message:"Unauthorized token not Provided"}) )
        }
        const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
        const decode=jwt.verify(token,JWT_SECRET_KEY)
        if(!decode){
        return res.status(403).json({message:"user not authorized"})
        }
        req.user=decode.userId;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"internal server error"})
    }
};