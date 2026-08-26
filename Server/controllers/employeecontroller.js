import {prisma} from "../config/db.js"

//create employee
export const createemployee = async(req,res)=>{
    try{
        const {firstName,lastName,phone,nationalId,gender,dateOfBirth,address,position,department,salary,hireDate,employmentStatus,userId}=req.body
        const employee = await prisma.employee.create({
            data:{
                firstName,lastName,phone,nationalId,gender,dateOfBirth:dateOfBirth ?new Date(dateOfBirth):null,address,position,department,salary,hireDate:hireDate ? new Date(hireDate):undefined,employmentStatus,
                user:{
                    connect:{
                        id:parseInt(userId)
                    }
                }

            }
        });
        res.status(200).json({success:true,message:"employee created successfully",employee})
    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"error message"})
        
        
    }
}
//get all employee
export const getAllemployees =async(req,res)=>{
    try{
        const employees =await prisma.Employee.findMany({
            orderBy:{
                id:"desc"
            }
        });
        res.status(200).json({success:true,message:"employees fetched successfully",employees});
}catch(error){
    console.error(error);
    res.status(500).json({success:false,massage:"error.message"})

}
    
}

//get employee by id
export const getemployeeById =async(req,res)=>{
    try{
        const {id}=req.params
        const employee=await prisma.Employee.findUnique({
            where:{
                id:parseInt(id)
            }
        });
        if(!employee){
            return res.status(404).json({success:false,message:"employee not found"})
        }
        res.status(200).json({success:true,message:"employee fetched successfuly",employee});
    }catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"error.message"})
    }
}

//update employee
export const updateemployee=async(req,res)=>{
    try{
        const{id}=req.params;
        const{firstName,lastName,phone,nationalId,gender,dateOfBirth,address,position,department,salary,hireDate,employmentStatus,userId}=req.body;
        const employee = await prisma.Employee.update({
            where:{
                id:parseInt(id)
            },
            data:{
                firstName,lastName,phone,nationalId,gender,dateOfBirth:dateOfBirth ?new Date(dateOfBirth):null,address,position,department,salary,hireDate:hireDate ? new Date(hireDate):undefined,employmentStatus,
                user:{
                    connect:{
                        id:parseInt(userId)
                    }
                }
            }
        });
        res.status(200).json({succes:true,message:"employee updated sucessfully",employee})
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}

}

//delete
export const deleteemployee=async(req,res)=>{
    try{
    const {id}=req.params;
    const employee =await prisma.Employee.delete({
        where:{
            id:parseInt(id)
        }
    });
    res.status(200).json({succes:true,message:"employee deleted succcessfully",employee})
    }catch(error){
        console.error(error);
        res.status(500).json({success:false,massage:"error.message"})
    }

    
}