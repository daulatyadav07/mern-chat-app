import express, { json } from "express"
import dotenv from "dotenv"
import { dbconnection } from "./lib/db.js";
import cookieParser from "cookie-parser";
import path from "path"
import UserRouter from "./routes/auth.routes.js";
import messagerouter from "./routes/message.routes.js";
import cloudinary from "./lib/cloudinary.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";
dotenv.config();
const PORT=process.env.PORT ||3000
const __dirname=path.resolve();
  app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
  }));
  app.use(express.json({limit:"10mb"}));
  app.use(cookieParser());
app.use("/auth/user",UserRouter);
app.use("/auth/user/message",messagerouter);
 if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../client/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","dist","index.html"))
  })
 }
server.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
    dbconnection();
})