import express from 'express';
import{register,login,logout, changePassword} from "../controllers/authcontroller.js"

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",logout);
router.post("/changePassword",changePassword);

  


export default router;