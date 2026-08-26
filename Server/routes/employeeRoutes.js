import express from 'express'
import { createemployee,getAllemployees,getemployeeById,updateemployee,deleteemployee } from '../controllers/employeecontroller.js'

const router = express.Router();

router.post("/",createemployee);
router.get("/",getAllemployees);
router.get("/:id",getemployeeById);
router.put("/:id",updateemployee);
router.delete("/:id",deleteemployee);

export default router;

