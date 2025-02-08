import { Request, Response } from "express";
import Prisma from "../prisma/client";
import {
  CommunityCommentInput,
  CommunityAnswerInput,
} from "../types/community.types";

// ✅ Create a new post (with username stored)
export const createPost = async (req: Request, res: Response) => {
  try {
    const { userId, content, isQuestion } = req.body;

    // Fetch the username from the User model
    const user = await Prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },  // ✅ Fetch `username` instead of `name`
    });    

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Save post with username
    const newPost = await Prisma.communityPost.create({
      data: {
        userId,
        username: user.username, // ✅ Store username
        content,
        isQuestion,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Fetch all posts (including comments & answers)
export const getAllCommunityPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Prisma.communityPost.findMany({
      include: {
        comments: true,
        answers: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// ✅ Fetch a single post by ID with comments & answers
export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id);

    const post = await Prisma.communityPost.findUnique({
      where: { id: postId },
      include: { comments: true, answers: true },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// ✅ Add a comment (with username stored)
export const addComment = async (req: Request, res: Response) => {
  try {
    const { userId, postId, content }: CommunityCommentInput = req.body;

    // Fetch username
    const user = await Prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },  // ✅ Fetch `username` instead of `name`
    });    

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const comment = await Prisma.communityComment.create({
      data: {
        userId,
        username: user.username, // ✅ Store username
        postId,
        content,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Failed to add comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// ✅ Add an answer (with username stored)
export const addAnswer = async (req: Request, res: Response) => {
  try {
    const { userId, postId, content }: CommunityAnswerInput = req.body;

    // Fetch username
    const user = await Prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },  // ✅ Fetch `username` instead of `name`
    });    

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const post = await Prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post || !post.isQuestion) {
      res.status(400).json({ error: "Invalid question ID" });
      return;
    }

    const answer = await Prisma.communityAnswer.create({
      data: {
        userId,
        username: user.username, // ✅ Store username
        postId,
        content,
      },
    });

    res.status(201).json(answer);
  } catch (error) {
    console.error("Failed to add answer:", error);
    res.status(500).json({ error: "Failed to add answer" });
  }
};
