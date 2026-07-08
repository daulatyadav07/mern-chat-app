import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import {useAuthCheck} from './store.js'
export const useChatStore=create((set,get)=>({
 messages:[],
 users:[],
 selectedUser:null,
 isMessagesLoading:false,
 isUserLoading:false,
 getUsers:async()=>{
    set({isUserLoading:true});
    try {
        const response=await axiosInstance.get("/message");
        set({users:response.data})
    } catch (error) {
        toast.error(error.response.data.message);
    }
    finally{
        set({isUserLoading:false});
    }
 },
 getMessages:async(id)=>{
 set({isMessagesLoading:true});
 try {
    const response=await axiosInstance.get(`/message/getMessage/${id}`);
    set({messages:response.data})
 } catch (error) {
    toast.error(error.message)
 }
 finally{
    set({isMessagesLoading:false})
 }
 },
 sendMessage: async(messageData)=>{
  const {selectedUser,messages}=get();
  try{
    const response= await axiosInstance.post(`/message/sendMessage/${selectedUser._id}`,messageData);
    set({messages:[...messages,response.data]})
  }
  catch(error){
  toast.error(error.response?.data?.message || "Failed to send Message")
  }
 },
 setSelectedUser:(selectedUser)=>{
 set({selectedUser})
 },
 subscribeToMessages:()=>{
   const {selectedUser}=get();
   if(!selectedUser) return
  const socket=useAuthCheck.getState().socket;
  if(!socket) return;
  socket.on("newMessages",(newMessage)=>{
   if(newMessage.senderId!==selectedUser._id) return;
   set({messages:[...get().messages,newMessage]})
  })
 },
 unsubscribeFromMessages:()=>{
   const socket=useAuthCheck.getState().socket;
   socket.off("newMessages");
 },
}));