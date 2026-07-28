import authRoutes from "./routes/auth.routes";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import workspaceRoutes from "./routes/workspace.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the Zabaku API!",
    });
});
console.log("✅ app.ts loaded");
app.use(errorMiddleware);

app.use("/workspaces", workspaceRoutes);

export default app;