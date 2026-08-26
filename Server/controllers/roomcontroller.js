import {prisma} from "../config/db.js"
//create room

export const createRoom = async (req,res)=>{
    const {roomNumber,floor,status,roomTypeId} = req.body;
    const room = await prisma.room.create({
        data:{
            roomNumber,
            floor,
            status,
            roomType: {
                connect: {
                    id: parseInt(roomTypeId)
                }

            }
        }
    });
    res.status(201).json({success:true, message:"Room created successfully", room});
}
            
        
    // res.status(201).json({success:true, message:"Room created successfully", room});

    //get all rooms
    export const getAllRooms = async (req,res)=>{
        const rooms = await prisma.room.findMany({
            include:{
                roomType:true
            }
        });
        res.status(200).json({success:true, message:"Rooms fetched successfully", rooms});
    }

    //get room by id
    export const getRoomById = async (req,res)=>{
        const {id} = req.params;
        const room = await prisma.room.findUnique({
            where:{
                id:Number(id)
            },
            include:{
                roomType:true
            }
        });
        if(!room){
            return res.status(404).json({success:false, message:"Room not found"});
        }

        res.status(200).json({success:true, message:"Room fetched successfully", room});
    }

    //update room
    export const updateRoom = async (req,res)=>{
        const {id} = req.params;
        const {roomNumber,floor,status,roomTypeId} = req.body;
        const room = await prisma.room.update({
            where:{
                id:parseInt(id)
            },
            data:{
                roomNumber,
                floor,
                status,
                roomType: {
                    connect: {
                        id: parseInt(roomTypeId)
                    }
                }
            }
        });
        res.status(200).json({success:true, message:"Room updated successfully", room});
    }
    
    //delete room
    export const deleteRoom = async (req,res)=>{
        const {id} = req.params;
        const room = await prisma.room.delete({
            where:{
                id:parseInt(id)
            }
        });
        res.status(200).json({success:true, message:"Room deleted successfully", room});
    }
