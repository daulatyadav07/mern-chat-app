import {Server} from 'socket.io';
import http from 'http'
import express from 'express';
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        credentials:true,
        methods:["GET","POST"]
    }
});
//used to store online users
const userSocketMap={}; //{userId:socket.id}
export const getRecevierSocketId=(userId)=>{
    return userSocketMap[userId]
};
io.on("connection",(socket)=>{
 console.log("A user connected",socket.id);
 const userId=socket.handshake.query.userId;
 if(userId) userSocketMap[userId]=socket.id;
 // emit to send events to all the connected client
 io.emit("getOnlineUsers",Object.keys(userSocketMap));
 socket.on("disconnect",()=>{
    console.log("A user disconnected");
    delete userSocketMap[userId];
    io.emit("")
 })
});
export {io,app,server};