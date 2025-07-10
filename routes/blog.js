import express from "express";
import { create_blog, get_blog, update_blog } from "../controllers/blog_controller.js";

const router = express.Router();

router.post("/blogs", create_blog);
router.get("/blogs", get_blog);
router.put("/blogs/:blog_id", update_blog);

export default router;
