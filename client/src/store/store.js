import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL=import.meta.env.NODE==="development"?"http://localhost:3001":"/";
export const useAuthCheck=create((set,get)=>(
  {
   authUser:null,
   isSigningUp:false,
   isLoging:false,
   isUpdatingProfile:false,
   isCheckingAuth:false,
   onlineUsers:[],
   socket:null,
   CheckAuthFunction:async()=>{
    set({isCheckingAuth:true})
     try{
      const response= await axiosInstance.get("/check");
      set({authUser:response.data})
      get().connectSocket();
     }
     catch(error){
      console.log(error.message)
      set({authUser:false})
     }
     finally{
      set({isCheckingAuth:false})
     }
   },
   signUp:async(data)=>{
   try {
      set({isSigningUp:true});
      const response=await axiosInstance.post("/signup",data);
      set({authUser:response.data});
      get().connectSocket();
      toast.success("Account Created Succesfully");
   }
    catch (error) {
    console.log(error.message);
    toast.error(error.response.data.message);
   }
   finally{
    set({isSigningUp:false})
   }
   },
   logout: async()=>{
     try {
      const response=await axiosInstance.post("/signout");
      set({authUser:null});
      toast.success("user logout succesfully");
      get().disconnectSocket();
     } catch (error) {
       toast.error(error.response?.data?.message)
     }
   },
  login:async(data)=>{
     set({isLoging:true})
    try {
      const response=await axiosInstance.post("/signin",data);
      set({authUser:response.data.user});
      toast.success("logged in successfully");
      get().connectSocket();
    } catch (error) {
       toast.error(error.response?.data?.message)
    }
    finally{
      set({isLoging:false})
    }
  },
  updateprofile:async(data)=>{
    set({isUpdatingProfile:true})
   try {
      const response=await axiosInstance.put("/updateProfile",data);
      set({authUser:response.data})
     toast.success("user profile updated successfully")
   } catch (error) {
    toast.error(error.response.data.message)
   console.log(error.message);
   }
   finally{
   set({isUpdatingProfile:false});
   }
  },
  connectSocket:()=>{
    const {authUser}=get();
    if (!authUser || get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    if(!authUser|| get().socket?.connected){ 
      return;
    }
    socket.connect();
    set({socket:socket});
    socket.on("getOnlineUsers",(usersIds)=>{
  set({onlineUsers:usersIds})
    })
  },
  disconnectSocket:()=>{
   if(get().socket?.connected) get().socket?.disconnect();
   set({socket:null,onlineUsers:[]})
  }
  }
))