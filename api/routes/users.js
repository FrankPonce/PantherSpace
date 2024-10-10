import express from "express";
import { getUser, updateUser, getAllUsers } from "../controllers/user.js";

const router = express.Router();

// Route to get a user by their ID
router.get("/find/:userId", getUser);

// Route to update a user (with userId in the URL)
router.put("/:userId", updateUser);

router.get("/all", getAllUsers);  // New route to fetch all users

export default router;
