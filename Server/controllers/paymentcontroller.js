import {prisma} from "../config/db.js";

//create payment
export const createPayment = async (req,res)=>{
    try{
    const {amount,paymentMethod,paymentStatus,transactionCode,paidAt,reservationId} = req.body;
    // Validate required fields
    // 
     if ( amount === undefined || !paymentMethod || !reservationId ){
         return res.status(400).json({ success: false, message: "Amount, paymentMethod and reservationId are required" }); 
        }
      // Convert values
      const paymentAmount = parseFloat(amount); 
      const reservationID = parseInt(reservationId); 
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
         return res.status(400).json({ success: false, message: "Amount must be a valid number greater than 0" });
         } 
         if (isNaN(reservationID)) {
             return res.status(400).json({ success: false, message: "Invalid reservation ID" }); 
            }
       // Check if reservation exists 
       const reservation = await prisma.reservation.findUnique({ where: { id: reservationID } }); if (!reservation) { return res.status(404).json({ success: false, message: "Reservation not found" }); }
    const payment = await prisma.payment.create({
        data:{
            amount: parseFloat(amount),
            paymentMethod,
            paymentStatus,
            transactionCode,
            paidAt:paidAt ? new(paidAt):null,
            reservation: {
                connect: {
                    id: parseInt(reservationId)
                }
            }

        }
    });
    res.status(201).json({success:true, message:"Payment created successfully", payment});
}
catch(error){ console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
}
}

//get all payments/
export const getAllPayments = async (req,res)=>{
    try{
    const payments = await prisma.payment.findMany({
        include:{
            reservation:true
        },
        orderBy:{
            id:"desc"
        }
    });
    res.status(200).json({success:true, message:"Payments fetched successfully", payments});
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}
}

//get payment by id
export const getPaymentById = async (req,res)=>{
    const {id} = req.params;
    const payment = await prisma.payment.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            reservation:true
        }
    });
    res.status(200).json({success:true, message:"Payment fetched successfully", payment});
}

//update payment
export const updatePayment = async (req,res)=>{
    const {id} = req.params;
    const {amount,paymentMethod,paymentStatus,transactionCode,paidAt,reservationId} = req.body;
    const payment = await prisma.payment.update({
        where:{
            id:parseInt(id)
        }, 
        data:{
            amount: parseFloat(amount),
            paymentMethod,
            paymentStatus,
            transactionCode,
            paidAt,
            reservation: {
                connect: {
                    id: parseInt(reservationId)
                }
            }
        }
    });
    res.status(200).json({success:true, message:"Payment updated successfully", payment});
}

//delete payment
export const deletePayment = async (req,res)=>{
    const {id} = req.params;
    const payment = await prisma.payment.delete({
        where:{

            id:parseInt(id)
        }
    });
    res.status(200).json({success:true, message:"Payment deleted successfully", payment});
}

//get payments by reservation id
export const getPaymentsByReservationId = async (req,res)=>{
    const {reservationId} = req.params;
    const payments = await prisma.payment.findMany({
        where:{
            reservationId:parseInt(reservationId)
        },
        include:{
            reservation:true
        }
    });
    res.status(200).json({success:true, message:"Payments fetched successfully", payments});
}
