import express from "express";
import { create_author } from "../controllers/author_controller.js";

const router = express.Router();

router.post("/author", create_author);

export default router;
