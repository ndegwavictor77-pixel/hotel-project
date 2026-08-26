import {prisma} from "../config/db.js"

//create 
export const createhousekeeping = async(req,res)=>{
    try{
    const {status,notes,cleanedAt,roomId}=req.body;
    const housekeeping = await prisma.houseKeeping.create({
        data:{
            status,
            notes,
            cleanedAt: cleanedAt ? new Date(cleanedAt):null,
            room:{
                connect:{
                    id:parseInt(roomId)
                }
            }
        }
        

    });
    res.status(200).json({success:true,message:"housekeeping created successfully",housekeeping})
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}
}

//getAll housekeeping
export const getAllhousekeepings = async(req,res)=>{
    const housekeeping = await prisma.houseKeeping.findMany({
        orderBy:{
            id:"desc"

        },
        include:{
            room:true
        }
    });
    res.status(200).json({success:true,message:"housekeeping fetched successfully",housekeeping})

}

//get housekeeping by id
export const gethousekeepingById=async(req,res)=>{
    try{
    const {id}=req.params;
    const housekeeping = await prisma.houseKeeping.findUnique({
        where:{
            id:Number(id)
        },
        include:{
            room:true
        }
    })
    if(!housekeeping){
        return res.status(404).json({success:true,message:"housekeeping not found"})
    }
    res.status(200).json({success:true,message:"housekeeping fetched successfully",housekeeping});
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}

    
}
//update
export const updatehousekeeping = async(req,res)=>{
    try{
    const{id}=req.params;
    const {status,notes,cleanedAt,roomId}=req.body;
    const housekeeping = await prisma.houseKeeping.update({
        where:{
            id:parseInt(id)
        },
        data:{
             status,
            notes,
            cleanedAt,
            room:{
                connect:{
                    id:parseInt(roomId)
                }
            }
        }
    });
    res.status(200).json({success:true,message:"housekeeping updated successfully",housekeeping})
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}
}

//delete
export const deletehousekeeping = async(req,res)=>{
    try{
        const {id}=req.params;
        const housekeeping = await prisma.houseKeeping.delete({
            where:{
                id:parseInt(id)
            }
        });
        res.status(200).json({success:true,message:"housekeeping deleted successfully",housekeeping})
    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"error.message"})
    }
}