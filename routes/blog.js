import express from "express";
import {
  create_blog,
  delete_blog,
  delete_blog_by_query,
  get_blog,
  update_blog,
} from "../controllers/blog_controller.js";

const router = express.Router();

router.post("/blogs", create_blog);
router.get("/blogs", get_blog);
router.put("/blogs/:blog_id", update_blog);
router.delete("/blogs/:blog_id", delete_blog);
router.delete("/blogs", delete_blog_by_query);

export default router;
