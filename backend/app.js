import express from "express";
import cors from "cors";
import { router as jobRoutes } from "./routes/jobRoutes.js";
import { router as userRoutes } from "./routes/userRoutes.js";
import { router as clerkRoutes } from "./routes/clerkRoutes.js";

export const app = express();

app.use(cors({ origin: "https://easy-connect-vite.vercel.app/" }));

//Webhook route placed before express.json() for raw body to send to Svix for verification
app.use("/webhook", clerkRoutes);

//Middleware
app.use(express.json()); //parse incoming JSON requests to use req.body

//Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);
