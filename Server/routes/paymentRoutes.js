import express from "express"
import { createPayment,getAllPayments, getPaymentById ,updatePayment,deletePayment,getPaymentsByReservationId} from "../controllers/paymentcontroller.js"

const router = express.Router();

router.post("/process", createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);
router.get("/reservation/:reservationId", getPaymentsByReservationId);

export default router;