import {prisma} from "../config/db.js";
import bcrypt from "bcryptjs"
import { generateToken } from "../utils/generateToken.js";
const register =async (req,res)=>{
    const{name,email,password,phone,role}=req.body;
    //check if user exist
     const userExists = await prisma.user.findUnique({
        where:{email: email},
     });
     if (userExists){
       return res.status(404).json({error:"user already exists with this email"});
       
       
     }
    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);

    //create user
    const user = await prisma.user.create({
        data:{
            name,
            email,
            password:hashedPassword,
            phone,
            role
        }
        
    });
     //generate tokens
    const token =generateToken(user.id, res);

    res.status(201).json({status:"success",
        data:{
            user:{
                id:user.id,
                name: name,
                email: email,

            },
            token,
        }
    })
}
//login

    const login=async(req,res)=>{
        const {email,password}=req.body;


        const user = await prisma.user.findUnique({
        where:{email: email},
        });

        if (!user){
       return res.status(401).json({error:"invalid email or password"});
       


    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    
    if(!isPasswordValid){
        return res.status(401).json({error:"invalid email or password"})
    }
    //generate tokens
    const token =generateToken(user.id,res);

     res.status(201).json({status:"success",
        data:{
            user:{
                id:user.id,
                email: email,

            },
            token,
        }
    })


};
//change password
const changePassword=async(req,res)=>{
    
        const{oldPassword,newPassword}=req.body

        const user = await prisma.user.findUnique({
            where:{
                id:parseInt(user.id)
            }

        });
        const isPasswordvalid=await bcrypt.compare(
            oldPassword,
            user.password
        )
        if(!isPasswordvalid){
            return res.status(400).json({
                success:false,
                message:"old password is incorrect"
            });
        }
        const hashedPassword=await bcrypt.hash(
            newPassword,
            10
        );
        await prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                password:hashedPassword
            }
        });
        res.status(200).json({
            success:true,
            message:"password changed succesdfully"
        })
}
const logout=async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        expires:new Date(0),
    })
    res.status(200).json({
        message:"logged out successfully",
    });
}


export{register,login,changePassword,logout};