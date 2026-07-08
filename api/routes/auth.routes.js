import Router from "express"
import {signup,signin,signout,updateProfile,checkAuth } from "../controller/auth.controller.js";
import {verifytoken} from "../middleware/verifytoken.js";
const router=Router();
router.post("/signup",signup);
router.post("/signin",signin);
router.post("/signout",signout);
router.put("/updateProfile",verifytoken,updateProfile);
router.get("/check",verifytoken,checkAuth);

export default router;