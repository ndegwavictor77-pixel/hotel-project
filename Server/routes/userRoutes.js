import express from "express";
import { getAllUsers, getUserById, updateUser, deleteUser,updateProfile } from "../controllers/usercontroller.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/profile", updateProfile);

export default router;