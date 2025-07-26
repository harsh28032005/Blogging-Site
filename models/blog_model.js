import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const blog_schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    author_id: { type: ObjectId, ref: "author", required: true, trim: true },
    tags: { type: [String] , default: []},
    category: { type: String, required: true },
    subcategory: { type: [String] },
    deletedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const blog = new mongoose.model("blog", blog_schema);

export default blog;