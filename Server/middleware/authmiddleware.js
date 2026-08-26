// import jwt from "jsonwebtoken";
// import { prisma } from "../config/db.js";

// export const authmiddleware=async(req,res,next)=>{
    
    
//     //read the token request
//     let token;

//     if(req.headers.authorization && req.headers.authorization.startswith("Bearer")){
//         token=req.headers.authorization.split("")[1]
//     }else if(req.cookies?.jwt){
//         token =req.cookies.jwt
//     }if(!token){
//         return res.status(401).json({error:"Not authorized, no token provided"});
//    }
//    try{
//     //verify token
//     const decoded = jwt.verify(token,process.env.JWT_SECRET);
//     const user = await prisma.user.findUnique({
//     where:{id:decoded.id}
//     });
//     if(!user){
//         return res.status(401).json({error:"user no longer exists"})
//     }
//     req.user=user;

//    }catch(err){
//     return res.status(401).json({error:"Not authorized, token failed"})

//    }
// };