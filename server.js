import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import proposalRoute from "./routes/proposalRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173","https://upwork-front-iota.vercel.app/"], credentials: true }));

app.use("/api", proposalRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

try {
  if (!MONGO_URL) {
    throw new Error("Mongo DB URL is missing in .env");
  }

  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected successfully");

  app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
  });
} catch (error) {
  console.error("Database connection error:", error.message);
}

export default app;