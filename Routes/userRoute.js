import express from "express";
import { userController } from "../Controller/userController.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();


const registerRoute=router.post('/register', userController.register);
const loginRoute=router.post('/login', userController.login);
const updateRoute=router.put('/update',userAuth, userController.update);




export  {registerRoute, loginRoute,updateRoute};