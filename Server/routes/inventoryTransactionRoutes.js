import express from 'express';


import { createInventoryTransaction,getAllInventoryTransactions,getInventoryTransaction,deleteInventoryTransaction } from "../controllers/inventoryTransactioncontroller.js";

const router=express.Router();

router.post("/",createInventoryTransaction);
router.get("/",getAllInventoryTransactions);
router.get("/:id",getInventoryTransaction);
router.delete(":id",deleteInventoryTransaction);

export default router;