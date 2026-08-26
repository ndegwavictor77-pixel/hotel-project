import express from 'express';
import { createGuestservice,getAllGuestservices,getGuestserviceById,updateGuestservice,deleteGuestservice } from '../controllers/guestservicecontroller.js';



const router =express.Router();

router.post("/",createGuestservice);
router.get("/",getAllGuestservices);
router.get("/:id",getGuestserviceById);
router.put("/:id",updateGuestservice);
router.delete("/:id",deleteGuestservice);

export default router;