
import express from "express";
import cors from "cors";
import { sendSMS, scheduleSMS } from "./twilioFunctions";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/send-sms", sendSMS);
app.post("/api/schedule-sms", scheduleSMS);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Health service listening on port ${PORT}`);
});

// Export the express app for Firebase Functions
export const healthApi = app;
