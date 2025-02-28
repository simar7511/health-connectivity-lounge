
import express from "express";
import cors from "cors";
import { sendSMS, scheduleSMS } from "./twilioFunctions";
import * as functions from "firebase-functions";

const app = express();
// Use a different port (8379 instead of 8378)
const PORT = process.env.PORT || 8379;

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

// Start server only if not in Firebase Functions environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Health service listening on port ${PORT}`);
  });
}

// Export the express app for Firebase Functions
export const healthApi = functions.https.onRequest(app);
