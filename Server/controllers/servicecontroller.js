import { prisma } from "../config/db.js"

//create service

export const createservice =async(req,res)=>{
    const{name,description,price}=req.body;
    const service = await prisma.service.create({
        data:{
            name,
            description,
            price
        }

    });
    res.status(200).json({success:true,message:"service created successfully",service});
}

//get all services
export const getAllservices = async(req,res)=>{
    const services = await prisma.service.findMany();
    res.status(200).json({success:true,message:"services fetched successfully",services})

}

//get service by Id
export const getserviceById=async(req,res)=>{
    const {id}=req.params;
    const service = await prisma.Service.findUnique({
        where:{
            id:Number(id)
        }
    });
    if(!service){
        return res.status(404).json({success:false,message:"service not found"});
    }
    res.status(200).json({success:true,message:"service fetched successfully",service})
}

//update service
export const updateservice = async(req,res)=>{
    const {id}=req.params;
    const service =await prisma.service.update({
        where:{
            id:parseInt(id)
        },
        data:{
             name,
            description,
            price
        }
    });
    res.status(200).json({success:true,message:"service updated successfully",service})
}

//delete service
export const deleteservice = async(req,res)=>{
    const{id}=req.params;
    const service = await prisma.service.delete({
        where:{
            id:parseInt(id)
        }
    });
    res.status(200).json({success:true,message:"service deleted successfully",service})
}