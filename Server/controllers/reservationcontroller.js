import {prisma} from "../config/db.js"

//create reservation
export const createReservation = async (req, res) => {
    const { guestId,roomId, checkIn, checkOut,adults,children,totalAmount,status } = req.body;
    const reservation = await prisma.reservation.create({
        data: {
        
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            adults: parseInt(adults),
            children: parseInt(children),
            totalAmount: parseFloat(totalAmount),
            status,
            guest: {
                connect: {
                    id: parseInt(guestId)
                }
            },
            room: {
                connect: {
                    id: parseInt(roomId)
                }
            }
           
        }
    });
    res.status(201).json({ success: true, message: "Reservation created successfully", reservation });
};

export const getAllReservations = async (req, res) => {
    try {
        const reservations = await prisma.reservation.findMany({
            include: {
                guest: true,
                room: true
            },
            orderBy: {
                id: "desc"
            }
        });

        res.status(200).json({
            success: true,
            reservations
        });
    } catch (error) {
        console.error("Get reservations error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reservations",
            error: error.message
        });
    }
};
// Get reservations for a specific guest
export const getGuestReservations = async (req, res) => {
    try {
        const { guestId } = req.params;

        const reservations = await prisma.reservation.findMany({
            where: {
                guestId: parseInt(guestId)
            },
            include: {
                room: true
            },
            orderBy: {
                checkIn: "desc"
            }
        });

        res.status(200).json({
            success: true,
            message: "Guest reservations fetched successfully",
            reservations
        });

    } catch (error) {
        console.error("Get guest reservations error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch guest reservations",
            error: error.message
        });
    }
};// CHECK IN
export const checkIn = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await prisma.reservation.update({
            where: {
                id: Number(id)
            },
            data: {
                status: "CHECKED_IN"
            }
        });

        res.status(200).json({
            success: true,
            message: "Guest checked in successfully",
            reservation
        });

    } catch (error) {
        console.error("CHECK IN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to check in guest",
            error: error.message
        });
    }
};


// CHECK OUT
export const checkOut = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await prisma.reservation.update({
            where: {
                id: Number(id)
            },
            data: {
                status: "CHECKED_OUT"
            }
        });

        res.status(200).json({
            success: true,
            message: "Guest checked out successfully",
            reservation
        });

    } catch (error) {
        console.error("CHECK OUT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to check out guest",
            error: error.message
        });
    }
};

//cancel reservation
export const cancelReservation = async (req, res) => {
    const { id } = req.params;  
    const reservation = await prisma.reservation.delete({
        where: {
            id: parseInt(id)
        },
        data:{
            status:"CANCELLED"
        }
    });
    res.status(200).json({ success: true, message: "Reservation canceled successfully", reservation });
}
//extend stay
export const extendStay = async (req, res) => {
    const { id } = req.params;
    const { newCheckOutDate } = req.body;
    const reservation = await prisma.reservation.update({
        where: {
            id: parseInt(id)
        },
        data: {
            checkOut: new Date(newCheckOutDate)
        }
    });
    res.status(200).json({ success: true, message: "Reservation extended successfully", reservation });
}