import { Message } from "../models/message.model.js";
import { conversationcollection } from "../models/conversation.model.js";
import {usercollection} from "../models/auth.models.js"
import cloudinary from "../lib/cloudinary.js";
import { getRecevierSocketId, io } from "../lib/socket.js";
export const sendMessage=async(req,res)=>{
    try {
      const senderId=req.user;
      const {recevierId}=req.params;
      const {text,image}=req.body;
      let imageUrl;
      if(image){
        const UploadResponse= await cloudinary.uploader.upload(image);
         imageUrl=UploadResponse.secure_url
      };
      const newMessage= new Message({
        senderId,
        recevierId,
        text,
        image:imageUrl
      });
       await newMessage.save();
       const recevierSocketId=getRecevierSocketId(recevierId);
       if(recevierSocketId){
        io.to(recevierSocketId).emit("newMessages",newMessage);
       }
       res.status(200).json(newMessage);
    } catch (error) {
      console.log(error.message)
      res.status(400).send({message:"internal server error"})
    }
};
export const getAllUser=async(req,res)=>{
   try {
    const loggedinId=req.user;
     const filterdUser=await usercollection.find({_id:{$ne:loggedinId}}).select("-password");
     res.status(200).json(filterdUser)
   } catch (error) {
    console.log(error.message);
    res.status(400).send({message:"internal server error"})
   }
};
export const getMessages= async(req,res)=>{
   try {
    const {id}=req.params;
    const myId=req.user;
     const messages=await Message.find({$or:[{senderId:myId,recevierId:id},
      {senderId:id,recevierId:myId}
     ]});
     res.status(200).json(messages);
   } catch (error) {
    console.log(error.message);
    res.status(400).send({message:"internal server error"});
   }
};