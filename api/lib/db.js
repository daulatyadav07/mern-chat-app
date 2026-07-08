import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
 export const dbconnection=async()=>{
  const URI=process.env.URI 
   try {
     await mongoose.connect(URI);
    console.log("db connected");
   } catch (error) {
    console.log(error.message);
   }
};
