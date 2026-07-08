import { usercollection } from "../models/auth.models.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cloudinary from "../lib/cloudinary.js";
dotenv.config();
export const signup= async(req,res)=>{
    try{
  const {fullname,email,password}=req.body;
  const userExit= await usercollection.findOne({email});
  if(userExit){
    return res.status(400).send({message:"Email already exits"});
  };
  const hashPassword= await bcrypt.hash(password,10);
  const User=new usercollection({
    fullname:fullname,
    email:email,
    password:hashPassword,
  });
  await User.save();
  const token=jwt.sign({userId:User._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"});
  res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production"});
  res.status(200).json(User);
}
catch(err){
  console.log(err.message);
  
    res.status(400).send({message:"server error"})
}
};
export const signin= async(req,res)=>{
 try {
   const{email,password}=req.body;
   const userExit=await usercollection.findOne({email:email});
   if(!userExit){
    return res.status(400).send({message:"Invalid Credintial"});
   }
   const isMatch=await bcrypt.compare(password,userExit.password);
   if(!isMatch){
    return res.status(400).send({message:"Invalid Credintial"});
   };
   const token=await jwt.sign({userId:userExit._id},process.env.JWT_SECRET_KEY,{expiresIn:"5d"});
   res.cookie("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production"});
   const { password, ...user } = userExit.toObject();
res.status(200).json({
  message: "User login successful",
  user,
});
 } catch (error) {
  console.log(error);
  res.status(400).send({message:"internal server error"})
 }
};
export const signout=(req,res)=>{
  try {
    res.clearCookie("token").status(200).send({message:"user logout"})
  } catch (error) {
    res.status(400).send({message:error.message});
  }
};
export const updateProfile=async(req,res)=>{
  try{   
    const {profilePic}=req.body;
    const userId=req.user;
    if (!profilePic) {
      return res.status(400).send({message: "No image provided"});
    }
    const uploadResponse=await cloudinary.uploader.upload(profilePic,{
      resource_type:"image",
    })
   const updateduser=await usercollection.findByIdAndUpdate(userId,{$set:{profilePic:uploadResponse.secure_url}},{new:true});
   res.status(200).json(updateduser);
  }
  catch (error) {
  console.log(error.message);
res.status(400).send({message:"internal server error"});
  
}
};
export const checkAuth=async(req,res)=>{
   try {
    const userId=req.user;
    const user=await usercollection.findById(userId);
     res.status(200).json(user);
   } catch (error) {
    console.log("error in checkAuth",error.message)
    res.status(400).send({message:""})
   }
}