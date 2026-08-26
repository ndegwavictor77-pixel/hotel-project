import express from 'express';
import {config} from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.js';
import hotelRoutes from "./routes/hotelRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import guestRoutes from "./routes/guestRoutes.js"
import reservationRoutes from "./routes/reservationRoutes.js"
import roomRoutes from "./routes/roomRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import roomtypeRoutes from "./routes/roomtypeRoutes.js"
import guestserviceRoutes from "./routes/guestserviceRoutes.js"
import serviceRoutes from "./routes/serviceRoutes.js"
import employeeRoutes from "./routes/employeeRoutes.js"
import housekeepingRoutes from "./routes/housekeepingRoutes.js"
import inventoryRoutes from "./routes/inventoryRoutes.js"
import inventoryTransactionRoutes  from "./routes/inventoryTransactionRoutes.js"
import auditlogRoutes from "./routes/auditlogRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"



config();
connectDB();
const app=express();
const port=8000;
app.use(express.json());
app.use(cors())


app.use(express.urlencoded({extended:true}));
app.use("/hotel",hotelRoutes)
app.use("/auth",authRoutes)
app.use("/user",userRoutes)
app.use("/guest",guestRoutes)
app.use("/reservations",reservationRoutes)
app.use("/room",roomRoutes)
app.use("/roomtype",roomtypeRoutes)
app.use("/payment",paymentRoutes)
app.use("/guestservice",guestserviceRoutes)
app.use("/service",serviceRoutes)
app.use("/employee",employeeRoutes)
app.use("/housekeeping",housekeepingRoutes)
app.use("/inventory",inventoryRoutes)
app.use("/inventoryTransaction",inventoryTransactionRoutes)
app.use("/auditlog",auditlogRoutes)
app.use("/expense",expenseRoutes)


app.get("/hello",(req,res)=>{
    res.json({message:"it works"})
})
 
 


app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`)
})

//database handler
//handle unhandled promise rejections(e.g database connection errors)
 process.on("unhandledRejection",(err)=>{
    console.error("unhandled Rejection:", err);
    Server.close(async()=>{
        await disconnectDB();
        process.exit(1);
    });
 });
 
//handle uncaught expections
 process.on("uncaughtException",async(err)=>{
    console.error("uncaught Expection:",err);
    await disconnectDB();
    process.exit(1);
 });

 //graceful shutdown
 process.on("SIGTERM",async()=>{
    console.log("SIGTERM received, shutting down gracefully");
    Server.clode(async()=>{
        await disconnectDB();
        process.exit(0);
    });
 });