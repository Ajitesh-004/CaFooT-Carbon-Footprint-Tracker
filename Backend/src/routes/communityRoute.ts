import express from "express";
import {
  getAllCommunityPosts,
  getPostById,
  addComment,
  addAnswer,
  createPost,
} from "../controllers/communityController";

const router = express.Router();

router.post("/post", createPost);
router.get("/posts", getAllCommunityPosts);
router.get("/post/:id", getPostById);
router.post("/comment", addComment);
router.post("/answer", addAnswer);

export default router;
