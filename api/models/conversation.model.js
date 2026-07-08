import mongoose from "mongoose";
const conversationSchema=mongoose.Schema({
 messageIds:[
    {
        type:mongoose.Types.ObjectId,
        ref:"Message",
        required:true
    }
 ],
 participants:[
    {
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true
    }
 ]
},{timestamps:true});
export const conversationcollection=mongoose.model("conversation",conversationSchema);