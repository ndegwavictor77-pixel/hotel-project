import express from 'express'
import { createhousekeeping,getAllhousekeepings,gethousekeepingById,updatehousekeeping,deletehousekeeping } from '../controllers/housekeepingcontroller.js'

const router= express.Router();


router.post("/",createhousekeeping);
router.get("/",getAllhousekeepings);
router.get("/:id",gethousekeepingById);
router.put("/:id",updatehousekeeping);
router.delete("/:id",deletehousekeeping);


export default router;