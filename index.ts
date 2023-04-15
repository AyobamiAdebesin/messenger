/**
 * @file index.ts
 * @description This file is the entry point for the application.
 * @version 1.0.0
 * Author: Ayobami Adebesin
 */

import express, { Express, Request, Response } from "express";
import { connectDB } from "./config/database";
import dotenv from "dotenv";

const riderRouter = require("./routers/riderRouter");
const customerRouter = require("./routers/customerRouter");
const orderRouter = require("./routers/orderRouter");

// Load env vars from .env file into process.env before we connect to the database
// This is so that we can use the environment variables in the database connection
// and also to start the server on the port specified in the .env file
dotenv.config();

// Create express app
const app: Express = express();
const port: string = process.env.PORT || "3000";

// Connect to DB
connectDB();

// Use json data
app.use(express.json());

app.use("/api/v1/riders", riderRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/orders", orderRouter);


// Route to index page
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
