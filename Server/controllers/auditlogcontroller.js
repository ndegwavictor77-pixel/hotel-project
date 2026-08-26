
import { prisma } from "../config/db.js";

// CREATE AUDIT LOG
export const createAuditLog = async (req, res) => {
    try {
        const {
            action,
            tableName,
            recordId,
            userId
        } = req.body;

        // Validate required fields
        if (!action || !tableName || !recordId || !userId) {
            return res.status(400).json({
                success: false,
                message: "action, tableName, recordId and userId are required"
            });
        }

        const auditLog = await prisma.auditLog.create({
            data: {
                action,
                tableName,
                recordId: Number(recordId),
                userId: Number(userId)
            }
        });

        res.status(201).json({
            success: true,
            message: "Audit log created successfully",
            auditLog
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL AUDIT LOGS
export const getAllAuditLogs = async (req, res) => {
    try {

        const auditLogs = await prisma.auditLog.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Audit logs fetched successfully",
            auditLogs
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ONE AUDIT LOG
export const getAuditLog = async (req, res) => {
    try {

        const { id } = req.params;
        const auditLogId = Number(id);

        if (isNaN(auditLogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid audit log ID"
            });
        }

        const auditLog = await prisma.auditLog.findUnique({
            where: {
                id: auditLogId
            },
            include: {
                user: true
            }
        });

        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Audit log fetched successfully",
            auditLog
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE AUDIT LOG
export const deleteAuditLog = async (req, res) => {
    try {

        const { id } = req.params;
        const auditLogId = Number(id);

        if (isNaN(auditLogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid audit log ID"
            });
        }

        const auditLog = await prisma.auditLog.findUnique({
            where: {
                id: auditLogId
            }
        });

        if (!auditLog) {
            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        await prisma.auditLog.delete({
            where: {
                id: auditLogId
            }
        });

        res.status(200).json({
            success: true,
            message: "Audit log deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
