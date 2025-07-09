import express from "express";
import { create_blog } from "../controllers/blog_controller.js";

const router = express.Router();

router.post("/blog", create_blog);

export default router;
