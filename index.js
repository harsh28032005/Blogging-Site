import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes/author.js";

const app = express();

app.use(express.json());

const url = process.env.MONGO_URL;

mongoose
  .connect(url)
  .then(() => console.log("MongoDB Database is connected successfully..."))
  .catch((err) => console.log("Error to connect MongoDB Database...",err));

app.use("",router)
app.listen(process.env.PORT, () => console.log(`Server is running on the port ${process.env.PORT}`))