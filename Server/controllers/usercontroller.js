import {prisma} from "../config/db.js"
//get users
export const getAllUsers = async(req,res)=>{
    const users=await prisma.user.findMany({
        orderBy:{
            createdAt:"desc"
        },
        select:{
         id:true,
         name:true,        
         email :true,      
         password:true,    
         phone :true,     
         createdAt :true,  
         updatedAt :true  

        },
    });
    res.status(200).json({success:true, message:"Users fetched successfully", users});
}

//get a single user
export const getUserById = async(req,res)=>{
    const {id} = req.params;
    const user = await prisma.user.findUnique({
        where:{
            id:Number(id)
        },
        select:{
         id:true,
         name:true,        
         email :true,      
         password:true,    
         phone :true,     
         createdAt :true,  
         updatedAt :true  
        }
    
    });
    if(!user){
        return res.status(404).json({success:false, message:"User not found"});
    }
    res.status(200).json({success:true, message:"User fetched successfully", user});
}
//update user
export const updateUser = async(req,res)=>{
    const {id} = req.params;
    const {name,email,phone,role} = req.body;
    const user = await prisma.user.update({
        where:{
            id:parseInt(id)
        },
        data:{
            id:parseInt(id),
            name,
            email,
            phone,
            role
        }
    });

    res.status(200).json({success:true, message:"User updated successfully", user});
}
//update profile
export const updateProfile = async(req,res)=>{
    const {id} = req.params;
    const {name,email,phone} = req.body;
    const user = await prisma.user.update({
        where:{
            id:parseInt(id)
        },
        data:{
            name,
            email,
            phone
        }
    });
    res.status(200).json({success:true, message:"Profile updated successfully", user});
}
//delete user
export const deleteUser = async(req,res)=>{
    const {id} = req.params;
    await prisma.user.delete({
        where:{
            id:parseInt(id)
        }
    });
    res.status(200).json({success:true, 
        message:"User deleted successfully"});
}