import express from "express";
import { create_blog, get_blog } from "../controllers/blog_controller.js";

const router = express.Router();

router.post("/blog", create_blog);
router.get("/blog", get_blog);

export default router;
