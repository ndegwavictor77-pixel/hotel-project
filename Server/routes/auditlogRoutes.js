import express from 'express';
import { createAuditLog,getAllAuditLogs,getAuditLog,deleteAuditLog } from '../controllers/auditlogcontroller.js';

const router = express.Router();

router.post("/",createAuditLog);
router.get("/",getAllAuditLogs);
router.get("/:id",getAuditLog);
router.delete("/:id",deleteAuditLog);

export default router;