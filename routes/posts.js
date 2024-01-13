import express from 'express'
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// READ 
router.get("/", getFeedPosts)
router.get("/user:id/posts", getUserPosts)

// UPDATE
router.patch("/:id/like", verifyToken, likePost)

export default router