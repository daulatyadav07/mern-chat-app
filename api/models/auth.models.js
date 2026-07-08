import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    }
},{timestamps:true});
export const usercollection=mongoose.model("User",userSchema);