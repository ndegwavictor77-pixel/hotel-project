import {prisma} from "../config/db.js"

//create guest
export const createGuest = async (req,res)=>{
    console.log("request body:", req.body);
    const {firstName,lastName,email,phone,idNumber,nationality,address} = req.body;
    const guest = await prisma.guest.create({
        data:{
            
            firstName,
            lastName,
            email,
            phone,
            idNumber,
            nationality,
            address
        }
    });
    res.status(201).json({success:true, message:"Guest created successfully", guest});
}

//get all guests
export const getAllGuests = async (req, res) => {
    try {
        const guests = await prisma.guest.findMany();

        res.status(200).json({
            success: true,
            guests: guests
        });

    } catch (error) {
        console.error("Get guests error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load guests",
            error: error.message
        });
    }
};

//get guest by id
export const getGuestById = async (req,res)=>{
    const {id} = req.params;
    const guest = await prisma.guest.findUnique({  
        where:{
            id:Number(id)
        }
    });
    if(!guest){
        return res.status(404).json({success:false, message:"Guest not found"});
    }
    res.status(200).json({success:true, message:"Guest fetched successfully", guest});
}
//update guest
export const updateGuest = async (req,res)=>{
    const {id} = req.params;
    const {firstName,lastName,email,phone,idNumber,nationality,address  } = req.body;
    const guest = await prisma.guest.update({
        where:{
            id:parseInt(id)
        },
        data:{
            
            firstName,
            lastName,
            email,
            phone,
            idNumber,
            nationality,
            address
        }
    });
    res.status(200).json({success:true, message:"Guest updated successfully", guest});
}   
//delete guest
export const deleteGuest = async (req,res)=>{
    const {id} = req.params;
    const guest = await prisma.guest.delete({
        where:{
            id:parseInt(id)
        }
    });
    res.status(200).json({success:true, message:"Guest deleted successfully", guest});
}


//search guest
export const searchGuest = async (req,res)=>{
    const {query} = req.query;
    const guests = await prisma.guest.findMany({
        where:{
            OR:[
                {
                    firstName:{
                        contains:query,
                        mode:"insensitive"
                    }
                },
                {
                    lastName:{
                        contains:query,
                        mode:"insensitive"
                    }
                },
                {
                    email:{
                        contains:query,
                        mode:"insensitive"
                    }
                }
            ]
        }
    });
    res.status(200).json({success:true, message:"Guests fetched successfully", guests});
}   
//get guest reservations
export const getGuestReservations = async (req,res)=>{
    const {id} = req.params;
    const reservations = await prisma.reservation.findMany({
        where:{
            guestId:Number(id)
        },
        include:{
            room:true,  
            hotel:true
        }   
    });
    res.status(200).json({success:true, message:"Reservations fetched successfully", reservations});
}