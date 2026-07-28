import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDatabase() {
    try {
        await mongoose.connect(env.MONGODB_URI);

        console.log("✅ Connected to MongoDB Atlas");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB");

        console.error(error);

        process.exit(1);
    }
}