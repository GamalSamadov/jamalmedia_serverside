import express from "express"
import { deletePost, getFeedPosts, getPostById, getUserPosts, likePost, updatePost } from "../controllers/posts.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

/* READ */
router.get("/", getFeedPosts)
router.get("/:userId/posts", getUserPosts)
router.get("/:id/", getPostById)

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost)
router.patch("/:id", verifyToken, updatePost)

// DELETE
router.delete("/:id", verifyToken, deletePost)

export default router
