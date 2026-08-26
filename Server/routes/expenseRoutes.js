import express from 'express';
import { createExpense,getAllExpenses,getExpense,updateExpense,deleteExpense } from '../controllers/expensecontroller.js';

const router =express.Router();

router.post("/",createExpense);
router.get("/",getAllExpenses);
router.get("/:id",getExpense);
router.put(":id",updateExpense);
router.delete("/:id",deleteExpense);

export default router;