import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createHttpServer } from "http";
import { handleGeneratePassage } from "./routes/passages";
import { handleSpeechRecognition } from "./routes/speech";
// VAPI implementation removed

// Load environment variables
dotenv.config();

const app = express();
const server = createHttpServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Speech App Backend is running",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.get("/api/user/profile", (req, res) => {
  // This would typically require authentication middleware
  res.json({
    message: "User profile endpoint - authentication required",
    authenticated: false
  });
});

// Passage generation endpoint
app.post("/api/generate-passage", handleGeneratePassage);

// Speech recognition endpoint
app.post("/api/speech-recognition", handleSpeechRecognition);

// VAPI endpoints removed

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.path
  });
});

// Export the app for production builds
export const createServer = () => app;

// Start the server only when this file is run directly
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}
