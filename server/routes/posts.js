import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";

const routes = Router();

/* READ */
routes.get("/", verifyToken, getFeedPosts);
routes.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
routes.patch("/:id/like", verifyToken, likePost);

export default routes;
