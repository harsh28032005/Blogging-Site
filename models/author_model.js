import mongoose from "mongoose";
const author_schema = mongoose.Schema({
  fname: { type: String, lowerCase: true, trim: true, required: true },
  lname: { type: String, lowerCase: true, trim: true, required: true },
  title: {
    type: String,
    enum: ["Mr", "Mrs", "Miss"],
    trim: true,
    required: true,
  },
  email: { type: String, unique: true },
  password: { type: String, required: true },
});

const author = new mongoose.model("author", author_schema);
export default author;
