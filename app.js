import express from "express";
import userRouter from "./routes/user.js"
import taskRouter from "./routes/task.js"
import {config} from 'dotenv';
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cors from "cors";

export const app = express();

config({
    path: "./data/.env",
});

// using middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    // origin: [process.env.FRONTEND_URL],
    origin: process.env.FRONTEND_URL.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

// using routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
    res.send("Nice working")
})

app.use(errorMiddleware);