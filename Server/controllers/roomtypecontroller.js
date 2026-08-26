import { prisma } from "../config/db.js";

// CREATE ROOM TYPE
export const createRoomType = async (req, res) => {
    try {
        const {
            name,
            description,
            pricePerNight,
            capacity
        } = req.body;

        console.log("CREATE ROOM TYPE BODY:", req.body);

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Room type name is required"
            });
        }

        const price = Number(pricePerNight);
        const roomCapacity = Number(capacity);

        if (isNaN(price)) {
            return res.status(400).json({
                success: false,
                message: "Price per night must be a valid number"
            });
        }

        if (isNaN(roomCapacity)) {
            return res.status(400).json({
                success: false,
                message: "Capacity must be a valid number"
            });
        }

        const roomType = await prisma.roomType.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                pricePerNight: price,
                capacity: roomCapacity
            }
        });

        return res.status(201).json({
            success: true,
            message: "Room type created successfully",
            roomType
        });

    } catch (error) {
        console.error("CREATE ROOM TYPE ERROR:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "A room type with this name already exists"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create room type",
            error: error.message
        });
    }
};


// GET ALL ROOM TYPES
export const getAllRoomTypes = async (req, res) => {
    try {
        const roomTypes = await prisma.roomType.findMany({
            orderBy: {
                id: "desc"
            }
        });

        return res.status(200).json({
            success: true,
            message: "Room types fetched successfully",
            roomTypes
        });

    } catch (error) {
        console.error("GET ROOM TYPES ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch room types",
            error: error.message
        });
    }
};


// GET ROOM TYPE BY ID
export const getRoomTypeById = async (req, res) => {
    try {
        const { id } = req.params;

        const roomType = await prisma.roomType.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!roomType) {
            return res.status(404).json({
                success: false,
                message: "Room type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Room type fetched successfully",
            roomType
        });

    } catch (error) {
        console.error("GET ROOM TYPE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch room type",
            error: error.message
        });
    }
};


// UPDATE ROOM TYPE
export const updateRoomType = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            pricePerNight,
            capacity
        } = req.body;

        const roomType = await prisma.roomType.update({
            where: {
                id: Number(id)
            },
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                pricePerNight: Number(pricePerNight),
                capacity: Number(capacity)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Room type updated successfully",
            roomType
        });

    } catch (error) {
        console.error("UPDATE ROOM TYPE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update room type",
            error: error.message
        });
    }
};


// DELETE ROOM TYPE
export const deleteRoomType = async (req, res) => {
    try {
        const { id } = req.params;

        const roomType = await prisma.roomType.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Room type deleted successfully",
            roomType
        });

    } catch (error) {
        console.error("DELETE ROOM TYPE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete room type",
            error: error.message
        });
    }
};