import express from 'express';
import { createinventory,getAllinventorys,getinventoryById,updateinventory,deleteinventory } from '../controllers/inventorycontroller.js';

const router=express.Router();

router.post("/",createinventory);
router.get("/",getAllinventorys);
router.get("/:id",getinventoryById);
router.put("/:id",updateinventory);
router.delete("/:id",deleteinventory);

export default router;