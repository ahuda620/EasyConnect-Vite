import express from "express";
import cors from "cors";
import { router as jobRoutes } from "./routes/jobRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json()); //Parse incoming JSON requests to use req.body

//Routes
app.use("/api/jobs", jobRoutes);
