import { prisma } from "../config/db.js";

// CREATE EXPENSE
export const createExpense = async (req, res) => {
    try {
        const {
            title,
            category,
            amount,
            description,
            expenseDate,
            
        } = req.body;

        if (!title || !category || !amount || !expenseDate) {
            return res.status(400).json({
                success: false,
                message: "title, category, amount, expenseDate and userId are required"
            });
        }

        const expense = await prisma.expense.create({
            data: {
                title,
                category,
                amount: Number(amount),
                description,
                expenseDate: new Date(expenseDate),
                
            }
        });

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL EXPENSES
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: {
                expenseDate: "desc"
            }
            
            
        });

        res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ONE EXPENSE
export const getExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expenseId = Number(id);

        if (isNaN(expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
           
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expense fetched successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE EXPENSE
export const updateExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expenseId = Number(id);

        if (isNaN(expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        const existingExpense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        });

        if (!existingExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        const {
            title,
            category,
            amount,
            description,
            expenseDate
        } = req.body;

        const expense = await prisma.expense.update({
            where: {
                id: expenseId
            },
            data: {
                ...(title !== undefined && { title }),
                ...(category !== undefined && { category }),
                ...(amount !== undefined && { amount: Number(amount) }),
                ...(description !== undefined && { description }),
                ...(expenseDate !== undefined && {
                    expenseDate: new Date(expenseDate)
                })
            }
        });

        res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const expenseId = Number(id);

        if (isNaN(expenseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid expense ID"
            });
        }

        const existingExpense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            }
        });

        if (!existingExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await prisma.expense.delete({
            where: {
                id: expenseId
            }
        });

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
