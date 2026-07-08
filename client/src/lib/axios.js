import axios from "axios";
export const axiosInstance=axios.create({
    baseURL:import.meta.env.NODE==="development"?"http://localhost:3001/auth/user":"/auth/user",
    withCredentials:true
});
