import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient({
    log: process.env.NODE_ENV ==="development"
    ? ["query","error","warn"]
    : ["error"],
});

export const connectDB= async()=>{
    try{
        await prisma.$connect();
        console.log("DB connected via prisma");
    }catch(error){
        console.error(`Database connection error:${error.message}`);
        process.exit(1);// stops the node.js and tells the system it stopped because of an error  

    }
    
};
export const disonnectDB=async()=>{
    await prisma.$disconnect();
};
export{prisma };
