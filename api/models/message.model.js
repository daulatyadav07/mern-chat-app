
import mongoose from "mongoose";
const messageSchema=mongoose.Schema({
    senderId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    recevierId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
},{timestamps:true});
export const Message=mongoose.model("Message",messageSchema);