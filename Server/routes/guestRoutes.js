import express from "express";
import {createGuest, getAllGuests, getGuestById, updateGuest, deleteGuest,searchGuest,getGuestReservations } from "../controllers/guestcontroller.js";
// import { authmiddleware } from "../middleware/authmiddleware.js";


const router = express.Router();  
// router.use(authmiddleware);

router.post("/",createGuest);
router.get("/", getAllGuests);
router.get("/search", searchGuest);
router.get("/:id", getGuestById);
router.put("/:id", updateGuest);
router.delete("/:id", deleteGuest);

router.get("/guest/:guestid",getGuestReservations);
export default router;