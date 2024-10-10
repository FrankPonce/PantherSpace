import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);  // Get all stories for the user
router.post("/", addStory);   // Add a new story
router.delete("/:id", deleteStory);  // Delete a specific story by ID

export default router;
