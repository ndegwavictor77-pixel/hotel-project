import { prisma } from "../config/db.js";



// CREATE INVENTORY TRANSACTION
export const createInventoryTransaction = async (req, res) => {
    try {
        const {
            inventoryId,
            type,
            quantity,
            reference     } = req.body;

        // Validate required fields
        if (!inventoryId || !type || !quantity) {
            return res.status(400).json({
                success: false,
                message: "inventoryId, type and quantity are required"
            });
        }

        const inventoryIdNumber = Number(inventoryId);
        const quantityNumber = Number(quantity);

        // Validate numbers
        if (isNaN(inventoryIdNumber) || isNaN(quantityNumber)) {
            return res.status(400).json({
                success: false,
                message: "inventoryId and quantity must be numbers"
            });
        }

        if (quantityNumber <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        // Validate transaction type
        if (!["IN", "OUT", "ADJUSTMENT"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type"
            });
        }

        // Find inventory
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: inventoryIdNumber
            }
        });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found"
            });
        }

        // Calculate new quantity
        let newQuantity = inventory.quantity;

        if (type === "IN") {
            newQuantity += quantityNumber;
        }

        if (type === "OUT") {
            if (quantityNumber > inventory.quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient inventory quantity"
                });
            }

            newQuantity -= quantityNumber;
        }

        if (type === "ADJUSTMENT") {
            newQuantity = quantityNumber;
        }

        // Update inventory and create transaction together
        const result = await prisma.$transaction(async (tx) => {

            const updatedInventory = await tx.inventory.update({
                where: {
                    id: inventoryIdNumber
                },
                data: {
                    quantity: newQuantity
                }
            });

            const transaction = await tx.inventoryTransaction.create({
                data: {
                    inventoryId: inventoryIdNumber,
                    type,
                    quantity: quantityNumber,
                    reference
                }
            });

            return {
                updatedInventory,
                transaction
            };
        });

        res.status(201).json({
            success: true,
            message: "Inventory transaction created successfully",
            transaction: result.transaction,
            inventory: result.updatedInventory
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL INVENTORY TRANSACTIONS
export const getAllInventoryTransactions = async (req, res) => {
    try {

        const transactions = await prisma.inventoryTransaction.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                inventory: true
            }
        });

        res.status(200).json({
            success: true,
            message: "Inventory transactions fetched successfully",
            transactions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ONE INVENTORY TRANSACTION
export const getInventoryTransaction = async (req, res) => {
    try {

        const { id } = req.params;

        const transactionId = Number(id);

        if (isNaN(transactionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        const transaction = await prisma.inventoryTransaction.findUnique({
            where: {
                id: transactionId
            },
            include: {
                inventory: true
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Inventory transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Inventory transaction fetched successfully",
            transaction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE INVENTORY TRANSACTION
export const deleteInventoryTransaction = async (req, res) => {
    try {

        const { id } = req.params;

        const transactionId = Number(id);

        if (isNaN(transactionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID"
            });
        }

        const transaction = await prisma.inventoryTransaction.findUnique({
            where: {
                id: transactionId
            }
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Inventory transaction not found"
            });
        }

        // Delete transaction
        await prisma.inventoryTransaction.delete({
            where: {
                id: transactionId
            }
        });

        res.status(200).json({
            success: true,
            message: "Inventory transaction deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
