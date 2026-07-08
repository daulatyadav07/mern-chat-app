 import { Route,Navigate,Routes } from "react-router-dom";
 import Navbar from "./components/Navbar.jsx";
 import HomePage from "./pages/HomePage.jsx";
 import LoginPage from "./pages/Login.jsx";
 import SignUpPage from "./pages/SignUpPage.jsx";
 import ProfilePage from "./pages/ProfilePage.jsx"
import { useEffect } from "react";
import {useAuthCheck} from "./store/store.js";
import {Loader} from "lucide-react"
import {Toaster} from 'react-hot-toast'
const App=()=>{
  const {authUser,isCheckingAuth,CheckAuthFunction}=useAuthCheck();
   useEffect(()=>{
   CheckAuthFunction();
  },[]);
  if(isCheckingAuth){
    return(
      <div className="flex items-center justify-center h-screen bg-base-100 text-base-content">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
 return(
  <div className="min-h-screen bg-base-100 text-base-content pt-16">
   <Navbar />
   <main className="pt-6">
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={authUser ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
   </main>
      <Toaster />
  </div>
 )
};
export default App;