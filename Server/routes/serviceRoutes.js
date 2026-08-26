import express from 'express'
import {createservice,getAllservices,getserviceById,updateservice,deleteservice} from "../controllers/servicecontroller.js"


const router = express.Router();

router.post("/",createservice);
router.get("/",getAllservices);
router.get("/:id",getserviceById);
router.put("/:id",updateservice);
router.delete("/:id",deleteservice);

export default router;