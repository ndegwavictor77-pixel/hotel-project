import {prisma} from "../config/db.js"

//create inventory

export const createinventory = async(req,res)=>{
    try{
    const {itemName,quantity,unit,reorderLevel}=req.body;

    const inventory = await prisma.inventory.create({
        data:{
            itemName,
            quantity,
            unit,
            reorderLevel

        }
    })
    res.status(200).json({success:true,message:"inventory created successfully",inventory})
    }
catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}

}


//get all inventory

export const getAllinventorys = async(req,res)=>{
    try{
    const inventorys = await prisma.inventory.findMany({
        orderBy:{
            id:"desc"
        }
    });
    res.status(200).json({success:true,message:"inventorys fetched successfully",inventorys});
}catch(error){
    console.error(error);
    res.status(500).json({success:false,message:"error.message"})
}
    
}

//get inventory by id
export const getinventoryById=async(req,res)=>{
    const{id}=req.params;
    const inventory = await prisma.inventory.findUnique({
        where:{
            id:Number(id)
        }
    });
    if(!inventory){
        return res.status(404).json({success:false,message:"inventory not found"})

    }
    res.status(200).json({success:true,message:"inventory fetched successfully",inventory})
}

// UPDATE INVENTORY
export const updateinventory = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            itemName,
            unit,
            reorderLevel
        } = req.body;

        const inventoryId = Number(id);

        // Validate ID
        if (isNaN(inventoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID"
            });
        }

        // Check if inventory exists
        const existingInventory = await prisma.inventory.findUnique({
            where: {
                id: inventoryId
            }
        });

        if (!existingInventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found"
            });
        }

        // Build update data
        const data = {};

        if (itemName !== undefined) {
            data.itemName = itemName;
        }

        if (unit !== undefined) {
            data.unit = unit;
        }

        if (reorderLevel !== undefined) {
            const level = Number(reorderLevel);

            if (isNaN(level) || level < 0) {
                return res.status(400).json({
                    success: false,
                    message: "reorderLevel must be a valid number"
                });
            }

            data.reorderLevel = level;
        }

        // Make sure something was provided
        if (Object.keys(data).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }

        // Update inventory
        const inventory = await prisma.inventory.update({
            where: {
                id: inventoryId
            },
            data
        });

        res.status(200).json({
            success: true,
            message: "Inventory updated successfully",
            inventory
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE INVENTORY
export const deleteinventory = async (req, res) => {
    try {
        const { id } = req.params;

        const inventoryId = Number(id);

        // Validate ID
        if (isNaN(inventoryId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID"
            });
        }

        // Check if inventory exists
        const inventory = await prisma.inventory.findUnique({
            where: {
                id: inventoryId
            },
            include: {
                transactions: true
            }
        });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found"
            });
        }

        // Don't delete inventory with transaction history
        if (inventory.transactions.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete inventory with transaction history"
            });
        }

        // Delete inventory
        await prisma.inventory.delete({
            where: {
                id: inventoryId
            }
        });
    

        res.status(200).json({
            success: true,
            message: "Inventory deleted successfully"
        })
    

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
