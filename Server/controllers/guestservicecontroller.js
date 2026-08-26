import {prisma} from "../config/db.js"

//create guest service
export const createGuestservice = async(req,res)=>{
    try{
    const{quantity,totalPrice,reservationId,serviceId}=req.body;
    const Guestservice = await prisma.guestService.create({
        data:{
            quantity,
            totalPrice,
            reservation:{
                connect:{
                    id: parseInt(reservationId)
                }

            },
            service:{
                connect:{
                    id: parseInt(serviceId)
                }
            }
        
            



        }
    
    });
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}
    res.status(200).json({success:true,message:"Guest service created successfully",guestservice});
}

//get all services
export const getAllGuestservices = async(req,res)=>{
    const guestservices = await prisma.guestService.findMany({
        include:{
            reservation:{
                include:{
                    guest:true,
                },
            },
            service:true,
        },
        orderBy:{
            id:"desc",
        }
    });
    res.status(200).json({success:true,message:"guestservice fetched successfully",guestservices});

}
//get guest service by id
export const getGuestserviceById = async(req,res)=>{
    const{id}=req.params;
    const Guestservice =await prisma.guestService.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            reservation:true,
            service:true
        }
    });
    if(!Guestservice){
        return res.status(404).json({success:false,message:"Guestservice not found"});
    }
    res.status(200).json({success:true,message:"geustservice fetched successfully",guestservice})
}
//update Guestservice
export const updateGuestservice = async(req,res)=>{
    const{id}=req.params;
    const {quantity,totalPrice,reservationId,serviceId}=req.body;
    const Guestservice = await prisma.guestService.update({
        where:{
            id:parseInt(id)
        },
        data:{
            quantity:parseInt(quantity),
            totalPrice,
            reservation:{
                connect:{
                    id: parseInt(reservationId)
                }

            },
            service:{
                connect:{
                    id: parseInt(serviceId)
                }
            }

        }
    });
    res.status(200).json({success:true,message:"Guestservice updated successfully",guestservice});
}
//delete
export const deleteGuestservice =async(req,res)=>{
    const {id}=req.params;
    const Guestservice = await prisma.guestService.delete({
        where:{
            id:parseInt(id)
        }
    });
    res.status(200).json({success:true,message:"Guestservice deleted successfully",guestservice})
}