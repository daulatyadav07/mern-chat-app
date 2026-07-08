import Router from "express"
import {sendMessage,getAllUser,getMessages} from "../controller/message.controller.js";
import {verifytoken} from "../middleware/verifytoken.js";
const messagerouter=Router();
messagerouter.get("/",verifytoken,getAllUser);
messagerouter.get("/getMessage/:id",verifytoken,getMessages);
messagerouter.post("/sendMessage/:recevierId",verifytoken,sendMessage);
export default messagerouter;
