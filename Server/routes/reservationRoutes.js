import express from "express";
import { createReservation, getGuestReservations,checkIn, checkOut, cancelReservation, extendStay,getAllReservations } from "../controllers/reservationcontroller.js";

const router = express.Router();

router.post("/", createReservation);
router.get("/",getAllReservations)
router.get("/guest/:guestId", getGuestReservations);
router.put("/:id/check-in", checkIn);
router.put("/:id/check-out", checkOut);
router.put("/:id/cancel", cancelReservation);
router.put("/:id/extend", extendStay);

export default router;